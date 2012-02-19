var CoolClock = function(id) {
    this.numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
    this.ints = ['half', 'ten', 'quarter', 'twenty', 'five', 'minutes'];
    this.dirs = ['to', 'past'];
    this.clock_el = $(id);
    this.clock_ints = [];
    this.clock_dirs = [];
    this.clock_nums = [];

    this.active = [];

    for(var i = 0; i < this.ints.length; i++)
    {
        this.clock_ints.push(
                $('<span class="clock-int clock-int-' + this.ints[i] + '">' + this.ints[i] + ' </span>').appendTo(this.clock_el)
                );
    }
    for(var i = 0; i < this.dirs.length; i++)
    {
        this.clock_dirs.push(
                $('<span class="clock-dir clock-dir-' + this.dirs[i] + '">' + this.dirs[i] + ' </span>').appendTo(this.clock_el)
                );
    }
    $('<br>').appendTo(this.clock_el);
    for(var i = 0; i < this.numbers.length; i++)
    {
        this.clock_nums.push(
                $('<span class="clock-num clock-num-' + this.numbers[i] + '">' + this.numbers[i] + ' </span>').appendTo(this.clock_el)
                );
    }
}

CoolClock.prototype.activate = function(el) {
    el.addClass('clock-on');
}

CoolClock.prototype.activateMinutes = function() {
    this.activate(this.clock_ints[5]);
}

CoolClock.prototype.activateHalf = function() {
    this.activate(this.clock_ints[0]);
}

CoolClock.prototype.activateTen = function() {
    this.activate(this.clock_ints[1]);
    this.activateMinutes();
}

CoolClock.prototype.activateQuarter = function() {
    this.activate(this.clock_ints[2]);
}

CoolClock.prototype.activateTwenty = function() {
    this.activate(this.clock_ints[3]);
    this.activateMinutes();
}

CoolClock.prototype.activateFive = function() {
    this.activate(this.clock_ints[4]);
    this.activateMinutes();
}

CoolClock.prototype.SetNum = function(date) {
    var num = date.getHours() % 12 - 1;
    var minutes = date.getMinutes();
    if(minutes >= 40) num++;
    num = num < 0 ? 11 : num;
    this.clock_nums.map(function(a) { a.removeClass('clock-on'); });
    this.activate(this.clock_nums[num]);
}

CoolClock.prototype.SetDir = function(date) {
    this.clock_dirs.map(function(a) { a.removeClass('clock-on'); });
    var minutes = date.getMinutes();
    if(minutes >= 40) {
        this.activate(this.clock_dirs[0]);
    } else {
        this.activate(this.clock_dirs[1]);
    }
}

CoolClock.prototype.SetInt = function(date) {
    this.clock_ints.map(function(a) { a.removeClass('clock-on'); });
    var minutes = date.getMinutes();
    if(minutes < 7) {
        this.activateFive();
    } else if(minutes < 13) {
        this.activateTen();
    } else if(minutes < 17) {
        this.activateQuarter();
    } else if(minutes < 23) {
        this.activateTwenty();
    } else if(minutes < 27) {
        this.activateTwenty();
        this.activateFive();
    } else if(minutes < 40) {
        this.activateHalf();
    } else if(minutes < 47) {
        this.activateQuarter();
    } else if(minutes < 53) {
        this.activateTen();
    } else if(minutes <= 59) {
        this.activateFive();
    }
}

CoolClock.prototype.SetAll = function(date) {
    this.SetNum(date);
    this.SetDir(date);
    this.SetInt(date);
}

CoolClock.prototype.Update = function() {
    this.SetAll(new Date());
}
