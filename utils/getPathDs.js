function getPaths(filename){
  // get the HTML collection of all the paths available
  let paths = document.getElementsByTagName('path');
  // create and array of the paths elements
  let pathArrays = Array.from(paths);
  let pathDs = pathArrays.map(d => d.getAttribute('d'))

  // return the path array
  return pathDs;

  console.log(JSON.stringify(pathDs));


}
