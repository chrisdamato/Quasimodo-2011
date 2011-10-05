3var TOP;
try { TOP=window; } catch(e) { TOP={}}
var sys;
try {
	debug=function(msg) {
		console.log(msg)
	}
} 
catch (e) {
	debug=function(msg) {
		return;
	}
}

//get or set dayIndex as number of days from Jan 1, 1970 UTC
Date.prototype._setDayIndex=function(i){this.setTime(i*86400000+this.getTimezoneOffset()*60000); return this};
Date.prototype._getDayIndex=function(){return parseInt((this)/86400000)};
//get or set minutes from local midnight of specified date
Date.prototype._getMFM=function(){return this.getHours()*60+this.getMinutes()};
Date.prototype._setMFM=function(mfm){this.setHours(parseInt(mfm/60));this.setMinutes(mfm%60);return this};

var MO = (function() {
    var mo={}; //the object that will be returned
    var DEFAULT_YEAR={
        PERIOD_TYPES:{
            0:"Rotator",
            1:"Course",
            2:"Lunch",
            3:"Tag",
            4:"STAR",
            5:"Unscheduled",
            6:"Other",
            7:"Unknown"
        },
        LETTERS:{0:"",1:"A",2:"B",3:"C",4:"D"},
        SCHEDULES:{
             //items[type,start,len, data] times in min from midnight
            0:{name:"No school",items:[]},
            1:{name:"Normal", items:[[3,437,20],[0,462,54,1], [0,521,54,2], [0,580,54,3], [2,639,40], [0,684,54,4], [0,743,54,5], [0,802,54,6]]},
            2:{name:"StarAM",items:[ [3,437,4], [0,446,52,1], [0,503,52,2], [4,560,30,3], [0,590,52,3], [2,647,39], [0,691,52,4], [0,748,52,5], [0,805,52,6] ]},
            3:{name:"StarPM",items:[ [3,437,4], [0,446,52,1], [0,503,52,2], [0,560,52,3], [0,617,52,4], [2,674,39], [4,718,30], [0,748,52,5], [0,805,52,6] ]},
            4:{name:"Activity",items:[ [3,437,20], [0,462,46,1], [0,513,46,2], [0,564,46,3], [2,615,40], [0,660,46,4], [0,711,46,5], [0,762,46,6], [6,813,44,"Activity"] ]},
            5:{name:"Delay",items:[ [3,557,14], [0,576,35,1], [0,616,35,2], [0,656,35,3], [2,696,40], [0,741,35,4], [0,781,35,5], [0,821,36,6] ]},
            6:{name:"Full 8",items:[ [3,437,22], [1,464,39,1], [1,508,39,2], [1,552,39,3], [1,596,39,4], [2,640,40], [1,685,39,5], [1,729,39,6], [1,773,39,7], [1,817,40,8] ]},
            7:{name:"Short 6",items:[ [3,437,18], [0,460,32,1], [0,497,32,2], [0,534,32,3], [0,571,32,4], [0,608,32,5], [0,645,32,6] ]},
            8:{name:"Short 8",items:[ [3,437,24], [1,466,22,1], [1,493,22,2], [1,520,22,3], [1,547,22,4], [1,574,22,5], [1,601,22,6], [1,628,22,7], [1,655,22,8] ]}
        },
        CAL:{15223:[1,2],
15224:[2,1],
15225:[3,3],
15226:[4,1],
15229:[1,1],
15230:[2,2],
15231:[3,1],
15232:[4,3],
15233:[1,1],
15236:[2,1],
15237:[3,2],
15238:[4,1],
15239:[1,3],
15240:[2,1],
15243:[3,1],
15244:[4,2],
15245:[1,1],
15247:[2,1],
15250:[3,1],
15251:[4,2],
15252:[1,1],
15253:[2,3],
15254:[3,1],
15258:[4,2],
15259:[1,1],
15260:[2,3],
15261:[3,1],
15264:[4,1],
15265:[1,2],
15266:[2,1],
15267:[3,3],
15268:[4,1],
15271:[1,1],
15272:[2,2],
15273:[3,1],
15274:[4,3],
15275:[1,1],
15278:[2,1],
15279:[3,2],
15280:[4,1],
15281:[1,3],
15282:[2,1],
15285:[3,1],
15286:[4,2],
15287:[1,1],
15292:[2,1],
15293:[3,2],
15294:[4,1],
15295:[1,3],
15296:[2,1],
15299:[3,1],
15300:[4,2],
15306:[1,1],
15307:[2,2],
15308:[3,1],
15309:[4,3],
15310:[1,1],
15313:[2,1],
15314:[3,2],
15315:[4,1],
15316:[1,3],
15317:[2,1],
15320:[3,1],
15321:[4,2],
15322:[1,1],
15323:[2,3],
15324:[3,1],
15327:[4,1],
15328:[1,2],
15329:[2,1],
15330:[3,3],
15331:[4,1],
15342:[1,2],
15343:[2,1],
15344:[3,3],
15345:[4,1],
15348:[1,1],
15349:[2,2],
15350:[3,1],
15351:[4,3],
15352:[1,1],
15356:[2,2],
15357:[3,1],
15358:[4,3],
15359:[1,1],
15362:[2,1],
15363:[3,2],
15364:[4,1],
15365:[1,3],
15366:[2,1],
15369:[3,1],
15370:[4,2],
15371:[1,1],
15372:[2,3],
15373:[3,1],
15376:[4,1],
15377:[1,2],
15378:[2,1],
15379:[3,3],
15380:[4,1],
15383:[1,1],
15384:[2,2],
15385:[3,1],
15386:[4,3],
15387:[1,1],
15392:[2,1],
15393:[3,3],
15394:[4,1],
15397:[1,1],
15398:[2,2],
15399:[3,1],
15400:[4,3],
15401:[1,1],
15404:[2,1],
15405:[3,2],
15406:[4,1],
15407:[1,3],
15408:[2,1],
15411:[3,1],
15412:[4,2],
15413:[1,1],
15414:[2,3],
15415:[3,1],
15418:[4,1],
15419:[1,2],
15420:[2,1],
15421:[3,3],
15422:[4,1],
15425:[1,1],
15426:[2,2],
15427:[3,1],
15428:[4,3],
15429:[1,1],
15440:[2,2],
15441:[3,1],
15442:[4,3],
15443:[1,1],
15446:[2,1],
15447:[3,2],
15448:[4,1],
15449:[1,3],
15450:[2,1],
15453:[3,1],
15454:[4,2],
15455:[1,1],
15456:[2,3],
15457:[3,1],
15460:[4,1],
15461:[1,2],
15462:[2,1],
15463:[3,3],
15464:[4,1],
15467:[1,1],
15468:[2,2],
15469:[3,1],
15470:[4,3],
15471:[1,1],
15474:[2,1],
15475:[3,2],
15476:[4,1],
15477:[1,3],
15478:[2,1],
15481:[3,1],
15482:[4,2],
15483:[1,1],
15484:[2,3],
15485:[3,1],
15489:[4,2],
15490:[1,1],
15491:[2,3],
15492:[3,1],
15495:[4,1],
15496:[1,2],
15497:[2,1],
15498:[3,3],
15499:[4,1],
15502:[1,1],
15503:[2,2],
15504:[3,1],
15505:[4,3],
15506:[1,1],
15509:[2,1],
15510:[3,2],
15511:[4,1],
15512:[1,3],
15513:[2,1],
}
    };
    var DEFAULT_USER={
        courses:{
            1:{name:"CP",lab:false},
            2:{name:"CP",lab:false},
            3:{name:"H",lab:true},
            4:{name:"Prep",lab:false},
            5:{name:"Prep",lab:false},
            6:{name:"H",lab:true},
            7:{name:"Prep",lab:false},
            8:{name:"CP",lab:false}
        },
        matrix:{
            //letter:[course in rotator 0, 1, 2, 3, 4, 5, 6]
            1:[0,1,2,3,5,6,7],
            2:[0,2,3,4,6,7,8],
            3:[0,3,4,1,7,8,5],
            4:[0,4,1,2,8,5,6]
        }
    };
    var _year=DEFAULT_YEAR;
    var _user=DEFAULT_USER;

    //internal variables
    var _date; //Date object
    var _calIndex, _schIndex, _ltrIndex;

    //exposed properties
    mo.getDate=function() {
        return _date;
    };
    mo.setDate=function (dateObj) {
        if (_.isUndefined(dateObj)) {
            dateObj=new Date();
        }
        _date=dateObj;
        _calIndex = _date._getDayIndex();
        if (_.isUndefined(_year.CAL[_calIndex])) _calIndex=0;
        _schIndex = _year.CAL[_calIndex][0];
        _ltrIndex=_year.CAL[_calIndex][1];
        return mo.getDate();
    };


    //internal functions
    function _time() {
        return _date.getHours()*60+_date.getMinutes();
    }
    
    function T(minutes) {
        var h = parseInt(minutes / 60);
        var m = parseInt(minutes - 60 * parseInt((minutes / 60)));
        return (h < 10 ? "" + h : h) + (":" + (m < 10 ? "0" + m : m));
    }

    mo.Day=function(dateObj, scheduleIndex, letterIndex) {
        //if (this === mo) throw "Constructor called as a function, I think";
        if (_.isNumber(dateObj)) {
            //if passed a number, use as an offset to current date (in days)
            dateObj = new Date((new Date).getTime()+dateObj*1000*60*60*24);
        }
        var day={}; //the object to return
        day.date=dateObj || new Date();
        day._calIndex = day.date._getDayIndex();
        if (_.isUndefined(_year.CAL[day._calIndex])) day._calIndex=0;
        day._schIndex = scheduleIndex || _year.CAL[day._calIndex][0];
        day._ltrIndex=letterIndex || _year.CAL[day._calIndex][1];
        day.schedule=_year.SCHEDULES[day._schIndex].name;
        day.letter=_year.LETTERS[day._ltrIndex]
        day.isSchoolDay=(day._calIndex===0)?false:(isFinite(day._calIndex)?true:undefined);
        day.periods=_.map(_year.SCHEDULES[day._schIndex].items,function(value,key,list){
            return period(day,key);
        });
        day.description=_.reduce(day.periods, function(memo, period){ return (memo>"")?memo+", "+period.name:period.name; }, "");
        day.now=function(dateObj) {
            var now={}; //the object to return
            var time;
            if (_.isUndefined(dateObj)) {
                dateObj = new Date();
            }
            time = dateObj._getMFM();

            now.Period = _.detect(day.periods, function(period) {
                return (period._start <= time && period._end > time)
            });
            now.nextPeriod = _.detect(day.periods, function(period) {
                return (period._start > time)
            });
            
            if (now.Period) {
                now.until = now.Period._end - time;
                now.description = now.Period.name + " ends in " + now.until;
                now.altDescription = "-" + now.until + " "+ now.Period.name + " ends" ;
            } else {
                if (now.nextPeriod) {
                    now.until = now.nextPeriod._start - time;
                    now.description = now.nextPeriod.name + " starts in " + now.until;
                    now.altDescription = "-" + now.until + " "+ now.nextPeriod.name + " starts" ;
                }
            }
        
            return now;
        };
        return day;
    }

    function whatsThis() {
        console.log(this);
    }

    function period (day,i) {
        try {
            var item=_year.SCHEDULES[day._schIndex].items[i];
        }
        catch(e){
            throw e;
        }
        if (_.isUndefined(item)) throw "schedule item is undefined";
        var typIndex=item[0];
        var start=item[1];
        var len=item[2];
        var data=item[3];
        var tmpPeriod={
//            _item:item,
//            _typIndex:typIndex,
//            _data:data,
//            _matrix:_user.matrix[_ltrIndex],
            id:day._calIndex+""+i,
            _start:start,
            _len:len,
            _end:start+len,
            start:T(start),
            end:T(start+len)
        };
//        return tmpPeriod;
        if (_year.PERIOD_TYPES[typIndex]=="Rotator") {
            //Swap the rotator for the appropriate course using the letter of the day and rotation matrix
            typIndex=1; //course
            //data is rotator number
            data=_user.matrix[day._ltrIndex][data];
            //data is now block number 1-8
            tmpPeriod.block=data;
        }
        if (typIndex==1) { //course
            _.extend(tmpPeriod,_user.courses[data]);
            tmpPeriod.block=data;
        } else {
            tmpPeriod.name=_year.PERIOD_TYPES[typIndex];
            tmpPeriod.type = typIndex;
            if (_.isString(data)) tmpPeriod.name=data;
            tmpPeriod.block="";
        }
        if (typIndex==6) { //other
            tmpPeriod.name=data;
        }
        tmpPeriod.description=tmpPeriod.start+"-"+tmpPeriod.end+" "+tmpPeriod.name;
        return tmpPeriod;
    }
    
    return mo;
})();

debug(MO.Day().now().altDescription);
