import { useEffect, useRef, useCallback } from 'react';
import * as go from 'gojs';

const useGojsDiagram = (model: go.Model) => {
  const diagramRef = useRef<HTMLDivElement | null>(null);

  const handleLinkDoubleClick = useCallback((_e: go.InputEvent, obj: go.GraphObject) => {
    const clickedLink = obj.part;
    if (clickedLink instanceof go.Link) {
      const diagram = clickedLink.diagram;
      if (!diagram) return;

      const linkData = clickedLink.data;
      if (linkData.count && linkData.count > 1 && linkData.links) {
        diagram.startTransaction("expand");

        diagram.remove(clickedLink);
        
        linkData.links.forEach((link: { text: string }, index: number) => {
          (diagram.model as go.GraphLinksModel).addLinkData({
            from: linkData.from,
            to: linkData.to,
            text: link.text,
            _index: index,
            isExpanded: true
          });
        });
        diagram.commitTransaction("expand");
      } else {
        const fromNode = clickedLink.fromNode;
        const toNode = clickedLink.toNode;
        if (fromNode && toNode) {
          const links = fromNode.findLinksTo(toNode);
          if (links.count > 1) {
            diagram.startTransaction("collapse");
            
            const linkTexts = Array.from(links, link => ({ 
              text: link.data.text 
            }));
            
            links.each(link => diagram.remove(link));
            
            (diagram.model as go.GraphLinksModel).addLinkData({
              from: fromNode.key,
              to: toNode.key,
              count: links.count,
              links: linkTexts,
              isExpanded: false
            });
            
            diagram.commitTransaction("collapse");
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    const $ = go.GraphObject.make;
    const diagram = new go.Diagram(diagramRef.current!, {
      'undoManager.isEnabled': true,
      layout: $(go.LayeredDigraphLayout, {
        direction: 0,
        layerSpacing: 150,
        columnSpacing: 50,
        setsPortSpots: false,
        packOption: go.LayeredDigraphLayout.PackStraighten
      })
    });

    diagram.nodeTemplate = $(go.Node, "Auto",
      {
        toolTip: $(go.Adornment, "Auto",
          $(go.Shape, { fill: "#EFEFEF", stroke: "#CCCCCC" }),
          $(go.TextBlock, { 
            margin: 8,
            font: "12px sans-serif",
            stroke: "black"
          }, new go.Binding("text", "text"))
        )
      },
      $(go.Shape, "Rectangle", {
        fill: "white",
        strokeWidth: 1,
        stroke: "black"
      }),
      $(go.TextBlock, {
        margin: 8,
        font: "14px sans-serif"
      }, new go.Binding("text", "text"))
    );

    diagram.linkTemplate = $(go.Link,
      {
        routing: go.Link.Orthogonal,
        corner: 10,
        fromSpot: go.Spot.Right,
        toSpot: go.Spot.Left,
        doubleClick: handleLinkDoubleClick
      },
      new go.Binding("points", "", (_, link) => {
        if (link.part instanceof go.Link) {
          const fromNode = link.part.fromNode;
          const toNode = link.part.toNode;
          if (fromNode && toNode) {
            const idx = link.part.data._index || 0;
            const offset = 20 + (idx * 15);
            
            const fromPoint = fromNode.getDocumentPoint(go.Spot.Right);
            const toPoint = toNode.getDocumentPoint(go.Spot.Left);
            
            return [
              fromPoint,
              new go.Point(fromPoint.x + offset, fromPoint.y),
              new go.Point(fromPoint.x + offset, toPoint.y),
              toPoint
            ];
          }
        }
        return null;
      }),
      $(go.Shape, { 
        strokeWidth: 1,
        stroke: "black" 
      }),
      $(go.TextBlock, {
        segmentIndex: 2,
        segmentOffset: new go.Point(5, 0),
        segmentOrientation: go.Link.None,
        background: "white",
        font: "12px sans-serif"
      }, 
        new go.Binding("text", "text"),
        new go.Binding("visible", "isExpanded")
      ),
      $(go.Panel, "Auto",
        {
          segmentIndex: 0,
          segmentOffset: new go.Point(10, 0),
          cursor: "pointer"
        },
        new go.Binding("visible", "", data => data.count > 1 && !data.isExpanded),
        $(go.Shape, "Circle", {
          fill: "#1E90FF",
          stroke: null,
          width: 20,
          height: 20
        }),
        $(go.TextBlock, {
          stroke: "white",
          font: "bold 10pt sans-serif"
        }, new go.Binding("text", "count"))
      )
    );

    diagram.groupTemplate = $(go.Group, "Auto",
      {
        layout: $(go.LayeredDigraphLayout)
      },
      $(go.Shape, "Rectangle", {
        fill: "transparent",
        stroke: "transparent"
      }),
      $(go.Panel, "Auto",
        $(go.Shape, "Circle", {
          fill: "#1E90FF",
          stroke: null,
          width: 20,
          height: 20
        }),
        $(go.TextBlock, {
          stroke: "white",
          font: "bold 10pt sans-serif"
        }, new go.Binding("text", "count"))
      )
    );

    diagram.model = model;
    diagram.toolTip = $(go.Adornment, "Auto",
      $(go.Shape, { 
        fill: "#EFEFEF",
        stroke: "#CCCCCC",
      }),
      $(go.Panel, "Vertical",
        { margin: 8 },
        $(go.Panel, "Horizontal",
          $(go.Shape, {
            geometryString: "M0 0 L8 0 L8 8 L0 8 Z M2 3 L6 3 M2 5 L6 5",
            fill: "transparent",
            stroke: "black",
            width: 12,
            height: 12,
            margin: new go.Margin(0, 4, 0, 0)
          }),
          $(go.TextBlock, { 
            font: "12px sans-serif",
            stroke: "black"
          }, new go.Binding("text", "", data => {
            const node = diagram.findNodeForKey(data.from);
            return node?.data.text || "";
          }))
        ),
        $(go.Panel, "Table",
          {
            margin: new go.Margin(4, 0),
            itemTemplate: $(go.Panel, "Auto",
              $(go.TextBlock,
                {
                  font: "italic 11px sans-serif",
                  stroke: "darkblue",
                  margin: new go.Margin(2, 0)
                },
                new go.Binding("text", "text")
              )
            )
          },
          new go.Binding("itemArray", "links")
        ),
        $(go.Panel, "Horizontal",
          $(go.Shape, {
            geometryString: "M0 0 L8 0 L8 8 L0 8 Z M2 3 L6 3 M2 5 L6 5",
            fill: "transparent",
            stroke: "black",
            width: 12,
            height: 12,
            margin: new go.Margin(0, 4, 0, 0)
          }),
          $(go.TextBlock, { 
            font: "12px sans-serif",
            stroke: "black"
          }, new go.Binding("text", "", data => {
            const node = diagram.findNodeForKey(data.to);
            return node?.data.text || "";
          }))
        )
      )
    );

    return () => {
      diagram.div = null;
    };
  }, [model, handleLinkDoubleClick]);

  return diagramRef;
};

export default useGojsDiagram;
