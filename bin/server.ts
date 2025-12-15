import * as path from 'path'
import * as http from 'http'
import * as fs from 'fs'
import mime from 'mime'

const rootDir = path.join(__dirname, '..');

const server = http.createServer();

server.listen(8080, '127.0.0.1', () => {
    console.log("Server successfully started. Connect to it at 127.0.0.1:8080");
});

server.on('request', (req, res) => {
    if(req.method === 'GET') {
        if(req.url === undefined) {
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 404;
            res.end('404 not found!');
            return;
        }
        console.log(req.url);
        serve(req.url, res);

        return;
    }

    return;
});

function serve(reqPath: string, res: http.ServerResponse) {
    let servePath = rootDir + '/dist';

    if(reqPath === '/') {
        servePath += '/index.html'
    } else {
        servePath += reqPath;
    }

    if(fs.existsSync(servePath)) {
        fs.readFile(servePath, (err, data) => {
            if(err) {
                console.error(err);
                res.setHeader('Content-Type', 'text/plain');
                res.statusCode = 500;
                res.end('Internal server error.');
            } else {
                let mimeType = mime.getType(servePath);

                // console.log(servePath)

                if(servePath.includes("glb")) {
                    mimeType = "model/gltf-binary";
                }

                res.setHeader('Content-Type', mimeType as string);
                res.statusCode = 200;
                res.end(data);
            }
        });
    } else {
        // console.log(servePath);
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 404;
        res.end('404 not found!');
    }
}