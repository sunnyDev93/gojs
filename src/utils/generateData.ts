import * as go from 'gojs';

interface NodeData {
  key: string;
  text: string;
}

interface LinkData {
  from: string;
  to: string;
  text: string;
  count?: number;
  links?: { text: string }[];
}

export const generateData = () => {
  const nodeDataArray: NodeData[] = [];
  const linkDataArray: LinkData[] = [];
  
  const nodeCount = Math.floor(Math.random() * 3) + 2; // 2-4 nodes
  
  for (let i = 1; i <= nodeCount; i++) {
    nodeDataArray.push({
      key: `node${i}`,
      text: `Node ${i}`
    });
  }

  for (let i = 0; i < nodeDataArray.length - 1; i++) {
    const from = nodeDataArray[i].key;
    const to = nodeDataArray[i + 1].key;
    
    const linkCount = Math.floor(Math.random() * 6) + 1;
    
    if (linkCount === 1) {
      linkDataArray.push({
        from,
        to,
        text: 'A',
        count: 1
      });
    } else {
      const individualLinks = Array.from({ length: linkCount }, (_, index) => ({
        text: String.fromCharCode(65 + index)
      }));

      linkDataArray.push({
        from,
        to,
        text: '',
        count: linkCount,
        links: individualLinks
      });
    }
  }

  return new go.GraphLinksModel(nodeDataArray, linkDataArray);
};
  