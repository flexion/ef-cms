export const swaggerBody = `<html>
<body>
  <head>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.24.2/swagger-ui.css">
  </head>
  <div id="swagger"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.24.2/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      dom_id: '#swagger',
      url: '/api/swagger.json',
      supportedSubmitMethods: []
    });
  </script>
</body>
</html>`;
