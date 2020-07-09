import AutoPilot from 'https://deno.land/x/autopilot/mod.ts';
import { parse } from "https://deno.land/std/flags/mod.ts";
import { signal } from "https://deno.land/std/signal/mod.ts";

const args = parse(Deno.args, {
    alias: {
        inactivity: "a",
        interval: "i",
        start: "s",
        stop: "p"
    },
    default: {
        interval: 10000,
        start: 0,
        stop: 24,
        inactivity: 300000
    }
});

const pilot = new AutoPilot();

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
    if(!wasActive) {
        pilot.notify("Do not sleep", "Do not sleep is now active");
    }
    wasActive = true;
    var pos = pilot.mousePosition();
    if(pos.x !== last.x && pos.y !== last.y) {
        lastUpdate = Date.now();
    } else {
        if(Date.now() - lastUpdate > args.inactivity) { // 5minutes
            pilot.moveMouse(pos.x + 1, pos.y + 1);
            pilot.notify("Do not sleep", "Your mouse was moved just now.");
        }
    }
}, args.interval);

console.log("Ready");

const exit = () => {
    console.log('Goodbye!');
    pilot.notify("Do not sleep", "Do not sleep stopped");
};

const sig = signal(
    Deno.Signal.SIGINT
);  

window.addEventListener("unload", exit);

function never() {
    return new Promise(async () => {
        for await (const _ of sig) {
            exit();
            Deno.exit();
        }
    });
}

await never();