import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Graph = ({ startingNodeId, handleNodeClick }) => {
  const svg_ref = useRef(null);
  const evaluate_button_ref = useRef(null);
  const cleanup_ref = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/argumentSchemas`);
        if (!response.ok) {
          throw new Error('Failed to fetch argument schemas');
        }
        const argument_schemas = await response.json();
        const argument_schema = argument_schemas.find(schema => schema._id === startingNodeId);
        if (!argument_schema) {
          throw new Error('Argument schema not found');
        }
        const svg = d3.select(svg_ref.current);
        svg.selectAll('*').remove();
        const nodes_group = svg.append('g');

        const rendered_nodes = new Set();

        const renderNodes = (node, x, y, nodesGroup) => {
          if (!node || !node._id || rendered_nodes.has(node._id)) return;

          const radius = 20;
          const attacker_spacing = 150;

          if (!rendered_nodes.has(node._id)) {

            nodesGroup.append('circle')
              .attr('id', `node-${node._id}`)
              .attr('cx', x)
              .attr('cy', y)
              .attr('r', radius)
              .attr('fill', '#1f77b4')
              .on('click', () => {
                if (handleNodeClick) {
                  handleNodeClick(node._id);
                }
              });

            rendered_nodes.add(node._id);
          }

          if (node.isAttackedBy && node.isAttackedBy.length > 0) {
            const initial_y_position = y - (node.isAttackedBy.length - 1) * attacker_spacing / 2;

            node.isAttackedBy.forEach((attackerId, index) => {

              if (!rendered_nodes.has(attackerId)) {
                const attacker_node = argument_schemas.find(schema => schema._id === attackerId);

                const attacker_y_position = initial_y_position + index * attacker_spacing;

                const arrow_start_x_position = x;
                const arrow_start_y_position = y;
                const arrow_end_x_position = x + (attacker_spacing - radius);
                const arrow_end_y_position = attacker_y_position;

                const line_length = Math.sqrt((arrow_end_x_position - arrow_start_x_position) ** 2 + (arrow_end_y_position - arrow_start_y_position) ** 2);

                const arrowhead_x_position = arrow_start_x_position + (radius / line_length) * (arrow_end_x_position - arrow_start_x_position);
                const arrowhead_y_position = arrow_start_y_position + (radius / line_length) * (arrow_end_y_position - arrow_start_y_position);

                const angle = Math.atan2(arrow_end_y_position - arrow_start_y_position, arrow_end_x_position - arrow_start_x_position);

                nodesGroup.append('line')
                  .attr('x1', arrowhead_x_position)
                  .attr('y1', arrowhead_y_position)
                  .attr('x2', arrow_end_x_position)
                  .attr('y2', arrow_end_y_position)
                  .attr('stroke', '#000000')
                  .attr('stroke-width', 2);

                nodesGroup.append('path')
                  .attr('d', d3.symbol().type(d3.symbolTriangle).size(80))
                  .attr('transform', `translate(${arrowhead_x_position},${arrowhead_y_position}) rotate(${angle * (180 / Math.PI) - 90})`)
                  .attr('fill', '#000000');

                const critical_question_id = attacker_node.chosenCriticalQuestion;

                if (critical_question_id === 3 || critical_question_id === 8) {

                  const mid_x_position = (arrow_start_x_position + arrow_end_x_position) / 2;
                  const mid_y_position = (arrow_start_y_position + arrow_end_y_position) / 2;

                  const second_arrowhead_angle = Math.atan2(arrow_end_y_position - arrow_start_y_position, arrow_end_x_position - arrow_start_x_position);

                  const second_arrowhead_distance = 30;
                  const second_arrowhead_x_position = mid_x_position + second_arrowhead_distance * Math.cos(second_arrowhead_angle);
                  const second_arrowhead_y_position = mid_y_position + second_arrowhead_distance * Math.sin(second_arrowhead_angle);

                  nodesGroup.append('path')
                    .attr('d', d3.symbol().type(d3.symbolTriangle).size(80))
                    .attr('transform', `translate(${second_arrowhead_x_position},${second_arrowhead_y_position}) rotate(${second_arrowhead_angle * (180 / Math.PI) + 90})`)
                    .attr('fill', '#000000');
                }

                renderNodes(attacker_node, arrow_end_x_position, arrow_end_y_position, nodesGroup);
              }
            });
          }
        };

        const handleEvaluateGraphClick = async () => {
          const evaluated_nodes = new Set(); 
          const winning_nodes = new Set();
          const losing_nodes = new Set();
          const undecided_nodes = new Set(); 
          const unevaluated_nodes = new Set(rendered_nodes); 

          const evaluateNode = (nodeId) => {
            if (evaluated_nodes.has(nodeId)) {
              if (winning_nodes.has(nodeId)) return 'winning';
              if (losing_nodes.has(nodeId)) return 'losing';
              return 'undecided'; 
            }
        
            evaluated_nodes.add(nodeId); 
            unevaluated_nodes.delete(nodeId); 
        
            const node = argument_schemas.find(schema => schema._id === nodeId);
            if (!node) {
              console.error('Node not found:', nodeId);
              return 'unevaluated';
            }
        
            if (node.isAttackedBy.length === 0) {
              winning_nodes.add(nodeId);
              return 'winning';
            } else {
              let attacker_evaluations = node.isAttackedBy.map(attackerId => evaluateNode(attackerId));
              
              if (attacker_evaluations.every(status => status === 'losing')) {
                winning_nodes.add(nodeId);
                return 'winning';
              } else if (attacker_evaluations.some(status => status === 'winning')) {
                losing_nodes.add(nodeId);
                return 'losing';
              } else {
                undecided_nodes.add(nodeId);
                return 'undecided';
              }
            }
          };
        
          evaluateNode(argument_schema._id);
        
          winning_nodes.forEach(nodeId => d3.select(`#node-${nodeId}`).style('fill', 'green'));
          losing_nodes.forEach(nodeId => d3.select(`#node-${nodeId}`).style('fill', 'red'));
          undecided_nodes.forEach(nodeId => d3.select(`#node-${nodeId}`).style('fill', 'grey'));
          unevaluated_nodes.forEach(nodeId => d3.select(`#node-${nodeId}`).style('fill', 'lightgrey')); // Color these nodes differently if needed
        
          console.log("Winning nodes:", [...winning_nodes]);
          console.log("Losing nodes:", [...losing_nodes]);
          console.log("Undecided nodes:", [...undecided_nodes]);
          console.log("Unevaluated nodes:", [...unevaluated_nodes]);
          console.log("Rendered nodes:", [...rendered_nodes]);
        };

        if (evaluate_button_ref.current) {
          evaluate_button_ref.current.addEventListener('click', handleEvaluateGraphClick);
        }

        cleanup_ref.current = () => {
          if (evaluate_button_ref.current) {
            evaluate_button_ref.current.removeEventListener('click', handleEvaluateGraphClick);
          }
        };

        renderNodes(argument_schema, window.innerWidth / 3, window.innerHeight / 2, nodes_group);
      } catch (error) {
        console.error('Error fetching argument schemas:', error);
      }
    };

    fetchData();

    return () => {
      if (cleanup_ref.current) {
        cleanup_ref.current();
      }
    };
  }, [startingNodeId, handleNodeClick]);

  return (
    <div style={{ position: 'relative', width: window.innerWidth * 0.95, height: window.innerHeight }}>
      <svg ref={svg_ref} width="100%" height="100%" style={{ border: '1px solid #ccc' }} />
      <button
        ref={evaluate_button_ref}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          padding: '10px',
          margin: '10px',
          zIndex: 1000
        }}
      >
        Evaluate Graph
      </button>
      <div style={{ position: 'absolute', top: '50px', right: '10px', zIndex: 1000 }}>
        <span style={{ color: 'green', marginRight: '10px' }}>Winning</span>
        <span style={{ color: 'red', marginRight: '10px' }}>Losing</span>
        <span style={{ color: 'grey' }}>Undecided</span>
      </div>
    </div>
  );
};

export default Graph;