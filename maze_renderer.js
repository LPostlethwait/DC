function renderMaze (maze_array, material, cell_dimension, wall_thickness, wall_height) {
    // IS A COMMENT IN THE CODE, LINES LIKE THIS WILL BE IGNORED BY THE COMPUTER
    
    // Some of the arguments of this function have default values.
    // The first thing we do inside the renderMaze function is set them.

    // The double pipe syntax: || is a boolean operator it works like
    // an operator in math such as addition or multiplication.
    // || is called the OR operator it checks if the value on the left is truthful,
    // if so it returns the left value, otherwise it returns the value on the right.
    // Example:
    //    var a = 1 || 0;
    //    a == 1;
    //    var b = 0 || a;
    //    b == 1;
    cell_dimension = cell_dimension || 5;
    wall_thickness = wall_thickness || 1;
    wall_height = wall_height || 5;

    // NOTE:
    //    the = operator sets a value of a variable
    //    the == operator checks if two values are equal
    
    // Next we store some useful values that relate to the maze walls being built.
    // We could calculate these later on when they're needed, without storing them in a variable.
    // Since those calculation would be done inside of a "loop" its more effectient to do them once
    // ahead of time.
    var cell_dimension_half = cell_dimension / 2,
        wall_thickness_half = wall_thickness / 2,
                      // maze_array is actually an array of arrays
                      // the first array stores a list of rows
                      // each row is an array that lists each cell in the maze
                      // each cell is also an array with 4 values that represent
                      // the 4 different directions one could go from the cell,
                      // more specifically what cell they might lead to, or if the
                      // way is blocked by a wall.
        maze_size_x = maze_array[0].length * cell_dimension,
        maze_size_y = maze_array.length * cell_dimension,
        maze_center_x = maze_size_x / 2,
        maze_center_y = maze_size_y / 2;
    
    // Create an empty array to store all the walls for the maze being rendered.
    // This is what we'll return at the end of the function passing so maze_walls
    // can be accessed wherever it was called.
    var maze_walls = [];

    // Next, create walls for the maze and append the to the maze_walls array.
    // In order to do this we have to "loop" through all the rows in maze_array,
    // and "loop" through all the cells in each row. This is also called iterating or
    // enumerating.

    maze_array.forEach(function (maze_row_array, y_position) {
        maze_row_array.forEach(function (maze_cell_array, x_position) {

            // Notice the two lines above ^^
            // They both have inline/anonymouse functions that will each get called
            // for each item stored in the associated array.
            // The first line iterates over each row in maze_array and calls the first function
            // for each one.
            // Each time the first function is called the second line gets invoked resulting in another
            // "loop". This is a nested loop. The second function will get called MANY more times than the first.
            // In this case it will iterator through each cell in each row of maze_array and calls
            // the second function for each cell.

            // maze_row_array - is a row inside of maze_array
            // y_position - is the index of the current row (maze_row_array) in maze_array

            // Example:
            //     maze_array[y_position] == maze_row_array

            // maze_cell_array - is a cell inside of the current row (maze_row_array)
            // x_position - is the index of the current cell (maze_cell_array) in the current row (maze_row_array)

            // Example:
            //     maze_row_array[x_position] == maze_cell_array;
            //     maze_array[y_position][x_position] == maze_cell_array
            
            // Calculate the center position of the maze cell
            var cell_center_x = x_position * cell_dimension + cell_dimension_half,
                cell_center_y = y_position * cell_dimension + cell_dimension_half;
            
            // Check if there is a wall on each of the 4 possible direction of the
            // maze cell. If there is a wall create a 3d box that represents the wall.
            // All the magic comes from the two appendWallAlongX() and appendWallAlongY()
            // functions which both call appendWall() a more generic function.

            if (maze_cell_array[0] === 0) appendWallAlongX(1); // TOP, border-top, +y
            if (maze_cell_array[1] === 0) appendWallAlongY(1); // RIGHT, border-right, +x 

            if (maze_cell_array[2] === 0) appendWallAlongX(-1); // BOTTOM, border-bottom, -y
            if (maze_cell_array[3] === 0) appendWallAlongY(-1); // LEFT, border-left, -x

            function appendWallAlongX (relative_offset) {
                appendWall(cell_dimension, 0, 0, relative_offset * cell_dimension_half);
            }
            
            function appendWallAlongY (relative_offset) {
                appendWall(0, cell_dimension, relative_offset * cell_dimension_half, 0);
            }
            
            function appendWall (x_size, y_size, x_offset, y_offset) {
                // Creates a cubeoid
                var maze_wall = new THREE.CubeGeometry(
                    wall_thickness + x_size,
                    wall_thickness + y_size,
                    wall_height
                );

                // Creates a mesh that can render our cuboid and gives it a material.
                var maze_wall_mesh = new THREE.Mesh(maze_wall, material);
                
                // Updates the position of the wall
                maze_wall_mesh.position = new THREE.Vector3(
                    cell_center_x + x_offset,
                    cell_center_y - y_offset,
                    -wall_height
                );

                // Appends the wall to the end of the maze_walls array/list
                maze_walls.push(maze_wall_mesh);
            }
        });
    });

    // Calls to renderMaze() will return a list/array of all the walls in a maze.
    // Example:
    //   var maze_walls_array = renderMaze(my_maze, maze_material);
    
    return maze_walls;
}