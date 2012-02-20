var CoolClock = function(id) {
    this.numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
    this.intObjects = 
        {
        'five': 
            {'interval': 5, 'number': true},
        'ten': 
            {'interval': 10, 'number': true},
        'quarter': 
            {'interval': 15, 'number': false},
        'twenty': 
            {'interval': 20, 'number': true},
        'half': 
            {'interval': 30, 'number': false},
        "o'clock":
            {'interval': 0, 'number': false},
        'minutes': {'interval': Infinity},
        };
    this.dirs = {'to':1, 'past':-1};
    this.clock_ints_objs = {};
    this.clock_dirs_objs = {};
    this.clock_nums = [];
    this.bound = false;

    if(typeof id !== 'undefined') {
        this.init(id);
        this.bound = true;
    }
}

CoolClock.prototype.init = function(id) {
    this.clock_el = $(id);
    for(var key in this.intObjects)
    {
        if(key == "o'clock") { continue; }
        this.clock_ints_objs[key] = 
            $('<span class="clock-int clock-int-' + key + '">'
              + key + ' </span>').appendTo(this.clock_el);
    }

    for(var key in this.dirs)
    {
        this.clock_dirs_objs[key] = 
                $('<span class="clock-dir clock-dir-' + key + 
                  '">' + key + ' </span>')
                .appendTo(this.clock_el);
    }
    $('<br>').appendTo(this.clock_el);
    for(var i = 0; i < this.numbers.length; i++)
    {
        this.clock_nums.push(
                $('<span class="clock-num clock-num-' + this.numbers[i] +
                  '">' + this.numbers[i] + ' </span>')
                .appendTo(this.clock_el)
        );
    }
    this.clock_ints_objs["o'clock"] =
        $('<span class="clock-int clock-int-oclock">o\'clock</span>')
        .appendTo(this.clock_el);
}

CoolClock.prototype.closestInt = function(date) {
    var minutes = date.getMinutes();
    var until = 60 - minutes;
    var minDiff = Infinity;
    var minInt = {};
    var minDir = 'past';

    if(until < minutes) {
        minutes = until;
        minDir = 'to';
    }

    for(var key in this.intObjects) {
        var curDiff = Math.abs(minutes - this.intObjects[key].interval);
        if(curDiff < minDiff) {
            minDiff = curDiff;
            minInt = key;
        }
    }

    if(minInt == "half") {
        minDir = 'past';
    }

    return {'interval': minInt, 'dir': minDir};
}

CoolClock.prototype.activate = function(el) {
    el.addClass('clock-on');
}

CoolClock.prototype.deactivate = function(el) {
    el.removeClass('clock-on');
}

CoolClock.prototype.activateMinutes = function() {
    this.activate(this.clock_ints_objs['minutes']);
}

CoolClock.prototype.SetNum = function(date, dir) {
    var num = this.GetNum(date, dir);
    this.clock_nums.map(function(a) { a.removeClass('clock-on'); });
    this.activate(this.clock_nums[num]);
}

CoolClock.prototype.GetNum = function(date, dir) {
    var num = date.getHours() % 12 - 1;
    var minutes = date.getMinutes();
    if(this.dirs[dir] === 1) num++;
    num = num < 0 ? 11 : num;
    return num;
}

CoolClock.prototype.SetInt = function(date) {
    objMap(this.clock_ints_objs, this.deactivate);
    objMap(this.clock_dirs_objs, this.deactivate);
    var minInt = this.closestInt(date);
    this.activate(this.clock_ints_objs[minInt.interval]);
    this.activate(this.clock_dirs_objs[minInt.dir]);

    if(this.intObjects[minInt.interval]['number']) {
        this.activateMinutes();
    }
    if(minInt.interval === "o'clock") {
        objMap(this.clock_dirs_objs, this.deactivate);
    }

    return minInt.dir;
}

CoolClock.prototype.SetAll = function(date) {
    var dir = this.SetInt(date);
    this.SetNum(date, dir);
}

CoolClock.prototype.Update = function() {
    this.SetAll(new Date());
}

CoolClock.prototype.GetTimeString = function(date) {
    var interval = this.closestInt(date);
    var num = this.GetNum(date, interval.dir);

    if(interval.interval === "o'clock") {
        return this.numbers[num] + ' ' + interval.interval;
    } else {
        return interval.interval + ' ' +
               (this.intObjects[interval.interval]['number'] ?
                   'minutes ' : '') +
               interval.dir + ' ' + 
               this.numbers[num];
    }
}

makeDate = function(h, m) { 
    return new Date('2012-2-19 ' + h + ':' + m + ':00'); 
}

objMap = function(obj, cb) { for(var k in obj) { cb(obj[k]); } }
