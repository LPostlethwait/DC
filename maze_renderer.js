function renderMaze (maze_array, material, cell_dimension, wall_thickness, wall_height) {
    
    if (maze_array.geometry) {
        return new THREE.Mesh(maze_array.geometry, material)
    }
    
    cell_dimension = cell_dimension || 5;
    wall_thickness = wall_thickness || 1;
    wall_height = wall_height || 5;

    var cell_dimension_half = cell_dimension / 2,
        wall_thickness_half = wall_thickness / 2,
        maze_size_x = maze_array[0].length * cell_dimension,
        maze_size_y = maze_array.length * cell_dimension,
        maze_center_x = maze_size_x / 2,
        maze_center_y = maze_size_y / 2;
    
    
    var maze_geometry = new THREE.Geometry(),
        maze_walls = [];

    // create maze walls
    maze_array.forEach(function (maze_row_array, y_position) {
        maze_row_array.forEach(function (maze_cell_array, x_position) {
            var cell_center_x = x_position * cell_dimension + cell_dimension_half,
                cell_center_y = y_position * cell_dimension + cell_dimension_half;
            
            if (maze_cell_array[0] === 0) appendWallAlongX(1); // border-top, +y
            if (maze_cell_array[1] === 0) appendWallAlongY(1); // border-right, +x 

            if (maze_cell_array[2] === 0) appendWallAlongX(-1); // border-bottom, -y
            if (maze_cell_array[3] === 0) appendWallAlongY(-1); // border-left, -x

            function appendWallAlongX (relative_offset) {
                appendWall(cell_dimension, 0, 0, relative_offset * cell_dimension_half);
            }
            
            function appendWallAlongY (relative_offset) {
                appendWall(0, cell_dimension, relative_offset * cell_dimension_half, 0);
            }
            
            function appendWall (x_size, y_size, x_offset, y_offset) {
                var maze_wall = new THREE.CubeGeometry(
                    wall_thickness + x_size,
                    wall_thickness + y_size,
                    wall_height
                );

                var maze_wall_mesh = new THREE.Mesh(maze_wall, material);
                
                maze_wall_mesh.position = new THREE.Vector3(
                    cell_center_x + x_offset,
                    cell_center_y - y_offset,
                    -wall_height
                );
                
                scene.add(maze_wall_mesh);
                
//                var transform_matrix = new THREE.Matrix4();
//                
//                transform_matrix.identity();
//                transform_matrix.makeTranslation(
//                    cell_center_x + x_offset,
//                    cell_center_y + y_offset
//                );
//                
//                maze_wall.applyMatrix(transform_matrix);
//                
//                maze_walls.push(maze_wall);
            }
        });
    });

    return;
    
    // combine maze walls
    maze_walls.forEach(function (maze_wall) {
        maze_geometry.vertices = maze_geometry.vertices.concat(maze_wall.vertices);
        maze_geometry.faces = maze_geometry.faces.concat(maze_wall.faces);
    });

    maze_geometry.mergeVertices();

    maze_geometry.verticesNeedUpdate = true;
    maze_geometry.elementsNeedUpdate = true;
    maze_geometry.normalsNeedUpdate = true;

    maze_geometry.computeCentroids();
    maze_geometry.computeFaceNormals();
    maze_geometry.computeVertexNormals();

    maze_geometry.computeBoundingBox();
    maze_geometry.computeBoundingSphere();
    
    return maze_array.geometry = new THREE.Mesh(maze_geometry, material);
}