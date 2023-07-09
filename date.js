// //jshint esversion:6

// exports.getDate = function() {

//     const today = new Date();
  
//     const options = {
//       weekday: "long",
//       day: "numeric",
//       month: "long"
//     };
  
//     return today.toLocaleDateString("en-US", options);
  
//   };
  
//   exports.getDay = function () {
  
//     const today = new Date();
  
//     const options = {
//       weekday: "long"
//     };
  
//     return today.toLocaleDateString("en-US", options);
  
//   };
  

exports.getTime = function() {
  const today = new Date();
  
  const options = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };
  
  return today.toLocaleTimeString("en-US", options);
};
