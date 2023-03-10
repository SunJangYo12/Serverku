PDFJS.disableWorker = false;

var pdfDoc = null,
  pageNum = 1,
  pageRendering = false,
  pageNumPending = null,
  scale = 1.9,
  canvas = document.getElementById('the-canvas'),
  ctx = canvas.getContext('2d');

  


  function renderPage(num) 
  {
      pageRendering = true;
      pdfDoc.getPage(num).then(function(page) 
      {
          var viewport = page.getViewport(scale);
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          var renderContext = {
              canvasContext: ctx,
              viewport: viewport
          };
        
          var renderTask = page.render(renderContext);
          renderTask.promise.then(function () 
          {
              document.title = 'Page: '+pageNum;

              pageRendering = false;
              if (pageNumPending !== null) 
              {
                  renderPage(pageNumPending);
                  pageNumPending = null;
              }
          });
      });

      document.getElementById('page_num').textContent = pageNum;
  }
    
  function queueRenderPage(num) {
      if (pageRendering) {
          pageNumPending = num;
      } 
      else {
          renderPage(num);
      }
  }

  function onPrevPage() {
      if (pageNum <= 1) {
          return;
      }
      pageNum--;
      document.title = 'Rendering...';
      queueRenderPage(pageNum);
  }

  function onNextPage() {
      if (pageNum >= pdfDoc.numPages) {
          return;
      }
      pageNum++;
      document.title = 'Rendering...';
      queueRenderPage(pageNum);
      onSavePage();
  }

  function onGotoPage() {
      var pageNo = document.getElementById("edtgo").value;
      if (pageNo < 1 || pageNo > pdfDoc.numPages) {
          return;
      }
      document.title = 'Rendering...';
      pageNum = parseFloat(pageNo);
      queueRenderPage(pageNum);
      onSavePage();
  }
  function onSavePage() {
      var xhr = new XMLHttpRequest();
      var savehisurl = "ajax-server.php?idexl=pdfhissave:"+hissave+":"+pageNum;
        
      xhr.open("GET", savehisurl, true);
      xhr.send();
  }
  
    
  function callGetDocment (response) {  
      PDFJS.getDocument(response).then(function getPdfHelloWorld(_pdfDoc) {
          pdfDoc = _pdfDoc;
          document.getElementById('page_count').textContent = pdfDoc.numPages;
          renderPage(pageNum);
      });
  }

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
      callGetDocment(e.currentTarget.response);
      document.title = 'Rendering...';
  };
  xhr.onerror = function  () {
      alert("The pdf may not be downloded or it may be xhr error.Please be patient as we are working on this issue.");
  }
  xhr.send();

  if (parseFloat(hispage) > 0) {
      var hisproc = parseFloat(hispage);
      pageNum = hisproc
  }
