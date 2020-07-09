import AutoPilot from 'https://deno.land/x/autopilot/mod.ts';
import { parse } from "https://deno.land/std/flags/mod.ts";

const args = parse(Deno.args, {
    alias: {
        interval: "i",
        start: "s",
        stop: "p"
    },
    default: {
        interval: 300000
    }
});

const pilot = new AutoPilot();

pilot.notify("Do not sleep", "Do not sleep is now running!");

var last = {
    x: 0,
    y: 0
};

var lastUpdate = Date.now();
var wasActive = false;

setInterval(() =>{
    if((new Date).getHours() < args.start || (new Date).getHours() > args.stop) {
        if(wasActive) pilot.notify("Do not sleep", "Do not sleep is now paused");
        wasActive = false;
        return;
    }
    wasActive = true;
    var pos = pilot.mousePosition();
    if(pos.x !== last.x && pos.y !== last.y) {
        lastUpdate = Date.now();
    } else {
        if(Date.now() - lastUpdate > args.interval) { // 5minutes
            pilot.moveMouse(pos.x + 1, pos.y + 1);
            pilot.notify("Do not sleep", "Your mouse was moved just now.");
        }
    }
}, 10000);