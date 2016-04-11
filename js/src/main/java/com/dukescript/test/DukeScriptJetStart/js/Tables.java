/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dukescript.test.DukeScriptJetStart.js;

import net.java.html.js.JavaScriptBody;

public class Tables {
    
    @JavaScriptBody(args = {"name", "id", "raw"}, body = "var snapshots = [{dummy: 0}];\n"
            + "raw[name] = new oj.ArrayTableDataSource(snapshots, {idAttribute: 'id'});\n"
            + "raw[name].remove(raw[name].at(0));")
    public static native void addTableData(String name, String id, Object raw);

    @JavaScriptBody(args = {"model", "snapshot"}, body = "model.data.add(snapshot);")
    public static native void addSnapShot(Object model, Object snapshot);

}
