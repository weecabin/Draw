
class Draw
{
  constructor(canvasId,fit=false)
  {
    AddStatus("entering constructor")
    this.fit = fit;
    this.dataset=[];
    this.c = document.getElementById(canvasId);
    AddStatus("got the canvas")
    this.ctx = this.c.getContext("2d");
    // set canvas up as cartesion 
    this.ctx.translate(0,this.c.height)
    this.ctx.scale(1,-1);
    this.lowerLeft=[0,0];
    this.upperRight=[this.c.width,this.c.height];
    AddStatus("Exiting constructor "+this.lowerLeft+" / "+this.upperRight)
  }
  
  ProposeScaling()
  {
    try
    {
    let xmin;
    let ymin;
    let xmax;
    let ymax;
    let set0;
    for(set0 of this.dataset)
    {
      AddStatus(set0.length+" points in set0");
      let point;
      for(point of set0)
      {
        point[0]=Number(point[0]);
        point[1]=Number(point[1])
        AddStatus("point: "+point+" ymin "+ymin);
        if(xmin==undefined)
        {
          xmin=point[0];
          xmax=point[0];
          ymin=point[1];
          ymax=point[1];
        }
        if (point[0]<xmin)
        {
          xmin=point[0];
          //redraw=true;
        }
        if (point[0]>xmax)
        {
          xmax=point[0];
          //redraw=true;
        }
          
        if (point[1]<ymin)
        {
          AddStatus("in point[1]<ymin... point: "+point+" ymin "+ymin);
          ymin=point[1];
          //redraw=true;
        }
        if (point[1]>ymax)
        {
          ymax=point[1];
          //redraw=true;
        }
      }
    }
    if (true)
    {
      //this.ctx.clearRect(0,0,this.c.width,this.c.height);
      //this.ctx.beginPath();
      //this.c.width=this.c.width;
      AddStatus("LowerLeft: "+this.lowerLeft+" UpperRight:"+this.upperRight)
      AddStatus("xmin xmax ymin ymax "+Number(xmin).toFixed(1)+" "+Number(xmax).toFixed(1)+" "+
      Number(ymin).toFixed(1)+" "+Number(ymax).toFixed(1))
      AddStatus("this.c.width "+this.c.width)
      let xscale = this.c.width / (xmax-xmin);
      let yscale = this.c.height / (ymax-ymin);
      AddStatus("xScale,yScale: "+xscale+","+yscale);
      let scale=1;
      if (xscale>=1 && yscale>=1)
        scale= xscale<yscale?xscale:yscale;
      else if (xscale<1 || yscale<1)
        scale = xscale<yscale?xscale:yscale;
      AddStatus("scale("+scale+","+(scale)+")")
       
      let xoffset=this.lowerLeft[0]-xmin;
      let yoffset=this.lowerLeft[1]-ymin;
      AddStatus("offset: "+xoffset+","+yoffset);
      let ret = ""+scale+" 0 0 "+scale+" "+xoffset+" "+yoffset;
      AddStatus("transform proposal:"+ret)
      return ret;
      //this.ctx.translate(0,this.c.height);
      //this.ctx.scale(scale,-scale);
    }
    }
    catch(err)
    {
      AddStatus(err.message)
    }
  }
  
  ClearCanvas()
  {
    try
    {
      // Store the current transformation matrix
      this.ctx.save();

      // Use the identity matrix while clearing the canvas
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0,0, this.c.width, this.c.height);
    
      // Restore the transform
      this.ctx.restore();
    }
    catch(err)
    {
      AddStatus(err.message);
    }
  }
  
  SetTransform(xscale,xskew,yskew,yscale,xoffset,yoffset)
  {
    try
    {
      AddStatus("Setting transform to "+xscale+","+xskew+","+yskew+","+yscale+","+xoffset+","+yoffset)
      xscale=Number(xscale);
      xskew =Number(xskew);
      yskew =Number(yskew);
      yscale =Number(yscale);
      xoffset =Number(xoffset);
      yoffset =Number(yoffset);
      this.ctx.transform(Number(xscale),Number(xskew),Number(yskew),Number(yscale),Number(xoffset),Number(yoffset));
      let dx = (this.upperRight[0]-this.lowerLeft[0])/xscale;
      let dy = (this.upperRight[1]-this.lowerLeft[1])/yscale;
      AddStatus("dx/dy "+dx+" "+dy);
      AddStatus("lowerLeft/upperRight "+this.lowerLeft+"/"+this.upperRight);
      this.lowerLeft[0]-=xoffset;
      this.lowerLeft[1]-=yoffset;
      this.upperRight[0]=this.lowerLeft[0]+dx;
      this.upperRight[1]=this.lowerLeft[1]+dy;
      AddStatus("new lowerLeft/upperRight "+this.lowerLeft+"/"+this.upperRight);
    }
    catch(err)
    {
      AddStatus(err.message)
    }
  }
  
  ReDraw()
  {
    try
    {
      AddStatus("redraw dataset:"+this.dataset)
      for(let pathset of this.dataset)
      {
        AddStatus("pathset: "+pathset)
        let firstpoint=true;
        for(let point of pathset)
        {
          AddStatus("point: "+point)
          if(firstpoint)
          {
            firstpoint=false;
            this.ctx.beginPath();
            AddStatus("moveTo("+point[0]+","+point[1]+")")
            this.ctx.moveTo(point[0],point[1])
          }
          else
          {
            AddStatus("lineTo("+point[0]+","+point[1]+")")
            this.ctx.lineTo(point[0],point[1]);
          }
        }
        this.ctx.stroke();
      }
    }
    catch(err)
    {
      AddStatus(err.message);
    }
    AddStatus("exit redraw")
  }
  
  Line(from,to)
  {
    this.dataset.push([]);
    this.dataset[this.dataset.length-1].push(from);
    this.dataset[this.dataset.length-1].push(to);
    AddStatus("line from "+from+" to "+to)
    this.ctx.beginPath();
    this.ctx.moveTo(from[0],from[1]);
    this.ctx.lineTo(to[0],to[1]);
    this.ctx.stroke();
  }
  /*
  draws a line from as defined by the double array of points
  [[x1,y1],[x2,y2]...]
  */
  Path(points)
  {
    this.dataset.push([]);
    this.dataset[this.dataset.length-1].push(points);
    AddStatus("path points\n"+points);
    this.ctx.beginPath();
    this.ctx.moveTo(points[0][0],points[0][1]);
    try
    {
      for(let i=1;i<points.length;i++)
      {
        this.ctx.lineTo(points[i][0], points[i][1]);
      }
      this.ctx.stroke();
    }
    catch(err)
    {
      AddStatus(err.message)
    }
  }
}

function newline()
{
  try
  {
    let pointstr=document.getElementById("newline").value;
    let fromto=pointstr.split(" ");
    let from=fromto[0].split(",");
    let to=fromto[1].split(",");
    d2.Line(from,to);
  }
  catch(err)
  {
    AddStatus(err.message);
  }
}

function ProposeScaling()
{
  document.getElementById("scaling").value=d2.ProposeScaling();
}

function ApplyScaling()
{
  try
  {
    let scaling=document.getElementById("scaling").value.split(" ");
    AddStatus(scaling);
    d2.SetTransform(scaling[0], scaling[1], scaling[2], scaling[3], scaling[4], scaling[5]);
  }
  catch(err)
  {
    AddStatus(err.message);
  }
}

function ClearCanvas()
{
  d2.ClearCanvas();
}

function ReDraw()
{
  d2.ReDraw();
}

let d2;
function setup()
{
  try
  {
    AddStatus("form load complete.",true);
    var d1 = new Draw("myCanvas");
  
    var points = [];
    for (x=0;x<=600;x+=20)
    {
      let y=Math.round(Math.pow(x,2)/600)
      points.push([x,y])
    }
    //d1.Path(points)
    d1.Line([0,0],[600,300])
    d1.Line([10,250],[280,250])    
    d1.Line([10,100],[280,100])  
    d1.Line([0,0],[300,300])
  
    AddStatus("myCanvas2")
    d2 = new Draw("myCanvas2",true);
    //d2.Path(points)
    //d2.Line([0,0],[600,300])
    //d2.Line([10,250],[280,250])    
    //d2.Line([10,100],[280,100])
    //d2.Line([0,0],[300,300])
  }
  catch(err)
  {
    AddStatus(err.message)
  }
}

function AddStatus(str,clear=false)
{
  if (clear) document.getElementById("status").value="";
  document.getElementById("status").value+="\n"+str
}

module.exports =
{
  Draw:Draw
}