var q = require("q"),
    Form = require("formidable"),
    whitelist = {"post": true}, // Lazy set
    core = function (req, res, next) {
        if (whitelist.hasOwnProperty(req.method.toLowerCase())) {
            var def = q.defer(),
                form = new Form.IncomingForm();
            form.parse(req, function(err, fields) {
                if (err) {
                    def.reject(err);
                } else {
                    req.body = fields;
                    def.resolve(next());
                }
            });
            return def.promise;
        } else {
            return next();
        }
    };

core.add = function(method) {
    whitelist[method.toLowerCase()] = true;
}
core.remove = function(method) {
    delete whitelist[method.toLowerCase()];
}

module.exports = core;
