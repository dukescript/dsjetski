package com.dukescript.test.DukeScriptJetStart.js;

import net.java.html.js.JavaScriptBody;

/** Use {@link JavaScriptBody} annotation on methods to
 * directly interact with JavaScript. See
 * http://bits.netbeans.org/html+java/1.2/net/java/html/js/package-summary.html
 * to understand how.
 */
public final class ModelExporter {
    private ModelExporter() {
    }
  
    @JavaScriptBody(args = { "name", "value" }, wait4js = false, body =
        "window[name] = value;"
    )
    public static native void export(String name, Object value);

}
