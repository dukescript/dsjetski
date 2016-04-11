package com.dukescript.test.DukeScriptJetStart;

import com.dukescript.test.DukeScriptJetStart.js.ModelExporter;
import com.dukescript.test.DukeScriptJetStart.js.Tables;
import net.java.html.json.Function;
import net.java.html.json.Model;
import net.java.html.json.Models;
import net.java.html.json.OnReceive;
import net.java.html.json.Property;
import net.java.html.require.Factory;

@Model(className = "Lightfish", targetId = "", properties = {
    @Property(name = "heapSize", type = Series.class, array = true),
    @Property(name = "threadCount", type = Series.class, array = true),
    @Property(name = "peakThreadCount", type = Series.class, array = true),
    @Property(name = "time", type = long.class, array = true),
    @Property(name = "url", type = String.class)
})
final class DataModel {
    private static Lightfish lightFish;

    static void onPageLoad() throws Exception {
        HomeModule homeModule = new HomeModule();
    }
    
    @Function
    public static void connect(Lightfish model) {
        model.connect(model.getUrl(), null);
    }

    @Model(className = "Snapshot", properties = {
        @Property(type = long.class, name = "id", mutable = false),
        @Property(type = long.class, name = "monitoringTime", mutable = false),
        @Property(type = long.class, name = "usedHeapSize", mutable = false),
        @Property(type = int.class, name = "threadCount", mutable = false),
        @Property(type = int.class, name = "peakThreadCount", mutable = false),
        @Property(type = int.class, name = "totalErrors", mutable = false),
        @Property(type = int.class, name = "currentThreadBusy", mutable = false),
        @Property(type = int.class, name = "committedTX", mutable = false),
        @Property(type = int.class, name = "rolledBackTX", mutable = false),
        @Property(type = int.class, name = "queuedConnections", mutable = false),
        @Property(type = int.class, name = "activeSessions", mutable = false),
        @Property(type = int.class, name = "expiredSessions", mutable = false),
        @Property(type = String.class, name = "deadlockedThreads", mutable = false),
        @Property(type = ConnectionPool.class, array = true, name = "pools", mutable = false),
        @Property(type = Application.class, name = "apps", array = true, mutable = false)
    }, targetId = "")
    public static class SnapshotVMD {
    }

    @Model(className = "ConnectionPool", properties = {
        @Property(type = String.class, name = "jndiName", mutable = false),
        @Property(type = int.class, name = "numconnfree", mutable = false),
        @Property(type = int.class, name = "waitqueuelength", mutable = false),
        @Property(type = int.class, name = "numpotentialconnleak", mutable = false),
        @Property(type = int.class, name = "numconnused", mutable = false)
    })
    public static class ConnectionPoolVMD {
    }

    @Model(className = "Application", properties = {
        @Property(type = String.class, name = "applicationName", mutable = false),
        @Property(type = String.class, name = "components", array = true, mutable = false)})
    public static class ApplicationVMD {
    }

    @Model(className = "Response", properties = {
        @Property(name = "snapshot", type = Snapshot.class)
    })
    public static class ResponseMD {
    }

    @Model(className = "Series", properties = {
        @Property(name = "name", type = String.class, mutable = false),
        @Property(name = "items", type = long.class, array = true, mutable = false)})
    public static class SeriesVMD {
    }
    
    @OnReceive(url = "{url}", method = "WebSocket", data = Response.class, onError = "onError")
    public static void connect(Lightfish model, Response response) {
        if (response == null) {
            return;
        }
        Snapshot snapshot = response.getSnapshot();
        Tables.addSnapShot(Models.toRaw(model), Models.toRaw(snapshot));
        Series heapSeries = model.getHeapSize().get(0).clone();
        heapSeries.getItems().add(snapshot.getUsedHeapSize());
        model.getHeapSize().set(0, heapSeries);
        Series threadSeries = model.getThreadCount().get(0).clone();
        threadSeries.getItems().add((long) snapshot.getThreadCount());
        model.getThreadCount().set(0, threadSeries);
        Series peakThreadSeries = model.getPeakThreadCount().get(0).clone();
        peakThreadSeries.getItems().add((long) snapshot.getPeakThreadCount());
        model.getPeakThreadCount().set(0, peakThreadSeries);
        model.getTime().add(snapshot.getMonitoringTime());
    }

    public static final void onError(Lightfish model, Exception ex) {
        System.out.println("error " + ex);
    }

    private static final class HomeModule extends Factory<Object> {

        public HomeModule() {
            super("viewModels/helloworld", "knockout", "ojs/ojknockout", "ojs/ojinputtext", "ojs/ojchart", "ojs/ojbutton",
                    "promise", "ojs/ojtable");
        }

        @Override
        protected Object create(Object... params) {
            ModelExporter.export("ko", params[0]);
            lightFish = new Lightfish();
            lightFish.getTime().add(System.currentTimeMillis());
            lightFish.setUrl("ws://localhost:8080/lightfish/snapshots/json/");
            Series heapSeries = new Series("Heap", new long[]{0});
            lightFish.getHeapSize().add(heapSeries);
            Series threadCountSeries = new Series("Threads", new long[]{0});
            lightFish.getThreadCount().add(threadCountSeries);
            Series peakThreadCountSeries = new Series("Threads", new long[]{0});
            lightFish.getPeakThreadCount().add(peakThreadCountSeries);
            Tables.addTableData("data", "id", Models.toRaw(lightFish));
            return Models.toRaw(lightFish);
        }
    }
}
