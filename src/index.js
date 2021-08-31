const app = require('./app')
require('./db/mongoose')

app.listen(port, () => {console.log('listening on port', port)})
