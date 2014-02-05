window.onWidgetLoad = function() {
  window.parent.postMessage(
    JSON.stringify({'widgetHeight': document.body.scrollHeight}),
    window.location.protocol + '//' + window.location.host);
};

function FileReadInput($scope) {
  $scope.answer = '';

  $scope.submitAnswer = function(el) {
    var theFile = el.files[0];

    if (theFile.size === 0) {
      alert('Please choose a non-empty file.');
      return;
    }
    if (theFile.size >= 1000) {
      alert('File too large. Please choose a file smaller than 1 kilobyte.');
      return;
    }

    var form = new FormData();
    form.append('file', theFile);

    $.ajax({
      url: '/filereadhandler',
      data: form,
      processData: false,
      contentType: false,
      type: 'POST',
      datatype: 'json',
      success: function(data) {
        console.log(data);
        var answer = data['base64_file_content'];
        if (!answer) {
          alert("An error occurred while processing your input.");
          return;
        }
        if (parent.location.pathname.indexOf('/explore') === 0) {
          window.parent.postMessage(
            JSON.stringify({'submit': answer}),
            window.location.protocol + '//' + window.location.host
          );
        }
      }
    });
  };
}
