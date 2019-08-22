execute : function loadJSON(response) {
    html =  '<!doctype html>' +
            '<html lang="en">' +
                '<head>' +
                    '<!-- Required meta tags -->' +
                    '<meta charset="utf-8">' +
                    '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">' +
                    '<!-- Bootstrap CSS -->' +
                    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">' +
                    '<!-- Material Design CSS --> ' +
                    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.5.7/css/mdb.min.css" />' +
                    '<!-- jQuery -->' +
                    '<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>' +
                    '<title>Boston University Integration Logs</title>' +
                '</head>' +
                '<body class="body py-5">' +
                    '<h3>Logs Display</h3>';
    
    // Function to display nested JSON data in a collapsible card
    function displayJSON(data) {
        // Start list-group for item
        html += '<div class="list-group-item text-left">';

        // Call function to display JSON object
        displayObject(data, false);

        html += '</div>' // close list-group-collapse

        // Function to display a JSON object
        function displayObject(data, child) {
            // Unpack entries into array
            var entries = Object.entries(data);
            // Loop through destructured array
            for (var [key, val] of entries) {

                key = clean(key);

                if (Array.isArray(val)) {
                    // Send to array function
                    displayArray(key, val);
                } else if (val instanceof Object) {
                    // Start a dropdown
                    if (child) {
                        html += '<details style="margin-left: 20px" open>';
                    } else {
                        html += '<details open>';
                    }
                    html += "<summary><strong>" + key + "</strong></summary>";
                    // Recursively call object function
                    displayObject(val, true);
                } else {
                    // Catcher for bottom level of nested JSON
                    if (child) {
                        // Indent if a child of detail
                        if (key != "Stacktrace") {
                            html += '<p style="margin-left: 20px"><strong>' + key + ': </strong> ' + val + '</p>';    
                        }
                        
                    } else {
                        html += '<p><strong>' + key + ': </strong> ' + val + '</p>';
                    }
                }
            }
        };


        // Function to break down a JSON array
        function displayArray(key, data) {
            // Open Array List
            html += '<li style="margin-left: 20px;list-style:none;" open>';
            html += "<summary><strong>" + key + "</strong></summary>";
            
            // Loop into sub items
            for (var i = 0; i < data.length; i++) {
                // Display directly if simple string
                if (Object.prototype.toString.call(data[i]) === '[object String]') {
                    html += '<p><strong>' + key + ': </strong> ' + data[i] + '</p>';
                } else {
                    html += '<li style="margin-left: 20px;list-style:none;" open>';
                    // Send each entry to object function
                    displayObject(data[i], true);
                    // Close sub-object details
                    html += "</li>";
                    if (i === (data.length - 1)) {
                        // Close most inner list
                        html += "</li>";
                        break;
                    } 
                }
            }
        };


        function clean(str) {
            return str.toLowerCase().split('_').map(function(word) {
                return (word.charAt(0).toUpperCase() + word.slice(1));
            }).join(' ');
        };
    }

    response.forEach(record => displayJSON(record));

    html += '</body>' +
            '</html>';
}


/**
 * Create an object that implements the methods defined by the "ScriptHook"
 * interface.  We'll be passing this object to the constructor for the
 * ScriptHook interface.
 */
var impl = {
    /*
     * These variables (input, output, error, log) are defined by the
     * ExecuteScript snap when evaluating this script.
     */
    input : input,
    output : output,
    error : error,
    log : log,

    /**
     * The "execute()" method is called once when the pipeline is started
     * and allowed to process its inputs or just send data to its outputs.
     *
     * Exceptions are automatically caught and sent to the error view.
     */
    execute : function () {
       this.log.info("Executing Transform Script");
        while (this.input.hasNext()) {
            // Read the next document
            var in_doc = this.input.next();
            var html = loadJSON(in_doc);
            
            this.output.write(html);
            this.log.info("Transform Script finished");
                
            


        }
    }
};

/**
 * The Script Snap will look for a ScriptHook object in the "hook"
 * variable.  The snap will then call the hook's "execute" method.
 */
var hook = new com.snaplogic.scripting.language.ScriptHook(impl);






