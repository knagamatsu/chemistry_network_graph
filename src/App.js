import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';

// 薄くモダンな緑のカラーパレット（透明度あり）
const colorPalette = [
  'rgba(227, 242, 229, 0.8)', 'rgba(200, 230, 201, 0.8)', 'rgba(165, 214, 167, 0.8)',
  'rgba(129, 199, 132, 0.8)', 'rgba(102, 187, 106, 0.8)', 'rgba(76, 175, 80, 0.8)',
  'rgba(67, 160, 71, 0.8)', 'rgba(56, 142, 60, 0.8)', 'rgba(46, 125, 50, 0.8)',
  'rgba(27, 94, 32, 0.8)', 'rgba(0, 77, 64, 0.8)', 'rgba(0, 121, 107, 0.8)',
  'rgba(0, 150, 136, 0.8)', 'rgba(0, 137, 123, 0.8)', 'rgba(0, 105, 92, 0.8)'
];

const chemistryNodes = [
  { id: 'Organic', label: 'Organic Chemistry', details: 'Study of compounds containing carbon' },
  { id: 'Inorganic', label: 'Inorganic Chemistry', details: 'Chemistry of non-carbon compounds' },
  { id: 'Physical', label: 'Physical Chemistry', details: 'Study of chemical systems using physics principles' },
  { id: 'Analytical', label: 'Analytical Chemistry', details: 'Identification and quantification of matter' },
  { id: 'Biochem', label: 'Biochemistry', details: 'Chemistry of living organisms' },
  { id: 'Polymer', label: 'Polymer Chemistry', details: 'Study of macromolecules and plastics' },
  { id: 'Nano', label: 'Nanochemistry', details: 'Chemistry at the nanoscale level' },
  { id: 'Computational', label: 'Computational Chemistry', details: 'Use of computers to solve chemical problems' },
  { id: 'Environmental', label: 'Environmental Chemistry', details: 'Study of chemical processes in nature' },
  { id: 'Medicinal', label: 'Medicinal Chemistry', details: 'Chemistry applied to drug discovery and development' },
  { id: 'Materials', label: 'Materials Chemistry', details: 'Design and synthesis of new materials' },
  { id: 'Spectroscopy', label: 'Spectroscopy', details: 'Study of interaction between matter and electromagnetic radiation' },
  { id: 'Catalysis', label: 'Catalysis', details: 'Study of catalysts and catalytic processes' },
  { id: 'Electrochemistry', label: 'Electrochemistry', details: 'Study of electricity and chemical reactions' },
  { id: 'Thermodynamics', label: 'Thermodynamics', details: 'Study of heat and energy in chemical systems' }
];

const NetworkGraph = () => {
  const [nodeCount, setNodeCount] = useState(10);
  const [linkCount, setLinkCount] = useState(15);
  const [chargeStrength, setChargeStrength] = useState(-300);
  const [linkDistance, setLinkDistance] = useState(50);
  const [selectedNode, setSelectedNode] = useState(null);
  const [data, setData] = useState({ nodes: [], links: [] });
  const [highlightedLink, setHighlightedLink] = useState(null);

  const generateData = useCallback(() => {
    const nodes = chemistryNodes.slice(0, nodeCount).map((node, i) => ({
      ...node,
      color: colorPalette[i % colorPalette.length],
      val: Math.floor(Math.random() * 5) + 1
    }));

    const links = Array.from({ length: linkCount }, () => ({
      source: nodes[Math.floor(Math.random() * nodes.length)].id,
      target: nodes[Math.floor(Math.random() * nodes.length)].id
    }));

    return { nodes, links };
  }, [nodeCount, linkCount]);

  useEffect(() => {
    const newData = generateData();
    setData(newData);
  }, [nodeCount, linkCount, generateData]);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  const handleLinkHover = useCallback((link) => {
    setHighlightedLink(link);
  }, []);

  const handleRegenerateGraph = () => {
    const newData = generateData();
    setData(newData);
    setSelectedNode(null);
  };

  const graphProps = useMemo(() => ({
    nodeRelSize: 4,
    nodeLabel: "label",
    nodeColor: node => node.color,
    nodeVal: node => node.val,
    linkColor: link => link === highlightedLink ? 'rgba(100, 100, 100, 0.8)' : 'rgba(200, 200, 200, 0.5)',
    linkWidth: link => link === highlightedLink ? 2 : 1,
    linkOpacity: 1,
    d3Force: {
      charge: { strength: chargeStrength },
      link: { distance: linkDistance }
    },
    onLinkHover: handleLinkHover
  }), [chargeStrength, linkDistance, highlightedLink, handleLinkHover]);

  return (
    <div className="flex w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="w-3/4 p-4">
        <div className="bg-white border border-gray-200 p-4 mb-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-4 gap-2 mb-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">Nodes:</label>
              <input
                type="number"
                value={nodeCount}
                onChange={(e) => setNodeCount(Math.min(15, Math.max(2, parseInt(e.target.value))))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Links:</label>
              <input
                type="number"
                value={linkCount}
                onChange={(e) => setLinkCount(Math.max(1, parseInt(e.target.value)))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Charge:</label>
              <input
                type="range"
                min="-1000"
                max="0"
                value={chargeStrength}
                onChange={(e) => setChargeStrength(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Distance:</label>
              <input
                type="range"
                min="10"
                max="300"
                value={linkDistance}
                onChange={(e) => setLinkDistance(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <button
            onClick={handleRegenerateGraph}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
          >
            Regenerate Graph
          </button>
        </div>
        <div className="h-[650px] bg-gray-50 rounded-lg shadow-inner overflow-hidden">
          <ForceGraph2D
            graphData={data}
            onNodeClick={handleNodeClick}
            width={800}
            height={650}
            {...graphProps}
          />
        </div>
      </div>
      <div className="w-1/4 bg-white p-4 border-l border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Node Details</h2>
        {selectedNode ? (
          <div>
            <p className="text-gray-700 font-semibold">{selectedNode.label}</p>
            <p className="text-gray-600 mt-2">{selectedNode.details}</p>
            <p className="text-gray-600 mt-2">Size value: {selectedNode.val}</p>
          </div>
        ) : (
          <p className="text-gray-600">Click on a node to see details</p>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Chemistry Domain Network Graph
      </h1>
      <NetworkGraph />
    </div>
  );
};

export default App;