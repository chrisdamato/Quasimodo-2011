var TOP;
try { TOP=window; } catch(e) { TOP={}}
var sys;
try {
	debug=function() {
        console.log(arguments)
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

var mo = (function() {
    var days = {0:[0,0],15223:[1,11],15224:[2,1],15225:[3,1],15226:[4,1],15229:[1,1],15230:[2,1],15231:[3,1],15232:[4,3],15233:[1,1],15236:[2,1],15237:[3,2],15238:[4,1],15239:[1,3],15240:[2,1],15243:[3,1],15244:[4,2],15245:[1,1],15247:[2,1],15250:[3,1],15251:[4,2],15252:[1,1],15253:[2,3],15254:[3,1],15258:[4,2],15259:[1,1],15260:[2,3],15261:[3,1],15264:[4,1],15265:[1,2],15266:[2,1],15267:[3,3],15268:[4,1],15271:[1,1],15272:[2,2],15273:[3,1],15274:[4,3],15275:[1,1],15278:[2,1],15279:[3,2],15280:[4,1],15281:[1,3],15282:[2,1],15285:[3,1],15286:[4,2],15287:[1,1],15292:[2,1],15293:[3,2],15294:[4,1],15295:[1,3],15296:[2,1],15299:[3,1],15300:[4,2],15306:[1,1],15307:[2,2],15308:[3,1],15309:[4,3],15310:[1,1],15313:[2,1],15314:[3,2],15315:[4,1],15316:[1,3],15317:[2,1],15320:[3,1],15321:[4,2],15322:[1,1],15323:[2,3],15324:[3,1],15327:[4,1],15328:[1,2],15329:[2,1],15330:[3,3],15331:[4,1],15342:[1,2],15343:[2,1],15344:[3,3],15345:[4,1],15348:[1,1],15349:[2,2],15350:[3,1],15351:[4,3],15352:[1,1],15356:[2,2],15357:[3,1],15358:[4,3],15359:[1,1],15362:[2,1],15363:[3,2],15364:[4,1],15365:[1,3],15366:[2,1],15369:[3,1],15370:[4,2],15371:[1,1],15372:[2,3],15373:[3,1],15376:[4,1],15377:[1,2],15378:[2,1],15379:[3,3],15380:[4,1],15383:[1,1],15384:[2,2],15385:[3,1],15386:[4,3],15387:[1,1],15392:[2,1],15393:[3,3],15394:[4,1],15397:[1,1],15398:[2,2],15399:[3,1],15400:[4,3],15401:[1,1],15404:[2,1],15405:[3,2],15406:[4,1],15407:[1,3],15408:[2,1],15411:[3,1],15412:[4,2],15413:[1,1],15414:[2,3],15415:[3,1],15418:[4,1],15419:[1,2],15420:[2,1],15421:[3,3],15422:[4,1],15425:[1,1],15426:[2,2],15427:[3,1],15428:[4,3],15429:[1,1],15440:[2,2],15441:[3,1],15442:[4,3],15443:[1,1],15446:[2,1],15447:[3,2],15448:[4,1],15449:[1,3],15450:[2,1],15453:[3,1],15454:[4,2],15455:[1,1],15456:[2,3],15457:[3,1],15460:[4,1],15461:[1,2],15462:[2,1],15463:[3,3],15464:[4,1],15467:[1,1],15468:[2,2],15469:[3,1],15470:[4,3],15471:[1,1],15474:[2,1],15475:[3,2],15476:[4,1],15477:[1,3],15478:[2,1],15481:[3,1],15482:[4,2],15483:[1,1],15484:[2,3],15485:[3,1],15489:[4,2],15490:[1,1],15491:[2,3],15492:[3,1],15495:[4,1],15496:[1,2],15497:[2,1],15498:[3,3],15499:[4,1],15502:[1,1],15503:[2,2],15504:[3,1],15505:[4,3],15506:[1,1],15509:[2,1],15510:[3,2],15511:[4,1],15512:[1,3],15513:[2,1]};
    var schedules = [
        { name:'None',items:[['No school',0,0]] },
        { name:'Normal', items:[['TAG',437,10], ['AM1',452,52], ['AM2',509,65], ['AM3',579,52], ['Lunch',631,45], ['PM1',681,52], ['PM2',738,64], ['PM3',808,52]] },
        { name:'STAR AM', items:[['TAG',437,3], ['AM1',446,50], ['STAR',501,29], ['AM2',531,57], ['AM3',593,50], ['Lunch',643,45], ['PM1',693,49], ['PM2',748,57], ['PM3',810,50]] },
        { name:'STAR PM', items:[['TAG',437,3], ['AM1',446,50], ['AM2',501,57], ['AM3',563,50], ['Lunch',613,45], ['PM1',663,50], ['STAR',718,30], ['PM2',748,57], ['PM3',810,50]] },
        { name:'Short 6', items:[['TAG',437,9], ['AM1',451,34], ['AM2',490,34], ['AM3',529,34], ['PM1',568,34], ['PM2',607,34], ['PM3',646,34]] },
        { name:'Delay', items:[['TAG',557,6], ['AM1',568,37], ['AM2',610,37], ['AM3',652,37], ['Lunch',689,45], ['PM1',739,36], ['PM2',781,36], ['PM',823,37]] },
        { name:'Activity', items:[['TAG',437,10], ['AM1',452,48], ['AM2',505,48], ['AM3',558,48], ['Lunch',606,45], ['PM1',656,48], ['PM2',709,48], ['PM3',762,48], ['Activity',815,45]] },
        { name:'Short 8', items:[['TAG',437,11], ['B1',453,24], ['B2',482,24], ['B3',511,24], ['B4',540,24], ['B5',569,24], ['B6',658,-36], ['B7',627,24], ['B8',716,-36]] },
        { name:'BTS', items:[['Welcome',1125,15], ['TAG',1145,5], ['B1',1155,10], ['B2',1170,10], ['B3',1185,10], ['B4',1200,10], ['B5',1215,10], ['B6',1230,10], ['B7',1245,10], ['B8',1260,10]] },
        { name:'Finals', items:[['Exam1',1170,120], ['Exam2',1300,120]] },
        { name:'Testing', items:[['Testing',437,198], ['Lunch',635,45], ['B1',685,40], ['B2',730,40], ['B3',775,40], ['B4',820,40]] },
        { name:'Full day 8', items:[['TAG',437,18], ['B1',460,40], ['B2',505,40], ['B3',550,40], ['B4',595,40], ['Lunch',635,45], ['B5',685,40], ['B6',730,40], ['B7',775,40], ['B8',820,40]] }
        ];
    var defaultMatrix = {
            //letter:[course in rotator 0, 1, 2, 3, 4, 5, 6]
            1:{TAG:0, AM1:1,AM2:2,AM3:3,PM1:5,PM2:6,PM3:7, B1:1, B2:2, B3:3, B4:4, B5:5, B6:6, B7:7, B8:8},
            2:{TAG:0, AM1:2,AM2:3,AM3:4,PM1:6,PM2:7,PM3:8, B1:1, B2:2, B3:3, B4:4, B5:5, B6:6, B7:7, B8:8},
            3:{TAG:0, AM1:3,AM2:4,AM3:1,PM1:7,PM2:8,PM3:5, B1:1, B2:2, B3:3, B4:4, B5:5, B6:6, B7:7, B8:8},
            4:{TAG:0, AM1:4,AM2:1,AM3:2,PM1:8,PM2:5,PM3:6, B1:1, B2:2, B3:3, B4:4, B5:5, B6:6, B7:7, B8:8}
        };
    var defaultUser = {
        0:{name:'Homeroom',block:0,moName:'TAG'},
        1:{name:'Block 1',block:1,moName:'1(A) 2(D) 3(C)'},
        2:{name:'Block 2',block:2,moName:'1(B) 2(A) 3(D)'},
        3:{name:'Block 3',block:3,moName:'1(C) 2(B) 3(A)'},
        4:{name:'Block 4',block:4,moName:'1(D) 2(C) 3(B)'},
        5:{name:'Block 5',block:5,moName:'5(A) 6(D) 7(C)'},
        6:{name:'Block 6',block:6,moName:'5(B) 6(A) 7(D)'},
        7:{name:'Block 7',block:7,moName:'5(C) 6(B) 7(A)'},
        8:{name:'Block 8',block:8,moName:'5(D) 6(C) 7(B)'},
        }
    var isRotator=new RegExp("[AP]M[123]","i");
    var isSchoolDay=function(dateObj) {
            return (dateObj._getDayIndex() in days);
        };
    var day=function(objDate, customUser, customMatrix) {
            //if no arg provided, returns next or current school day
            if (objDate==undefined) {
                objDate=Date.today(); //http://code.google.com/p/datejs/
                var last=Date.parse('9/1/2012');
                while (!isSchoolDay(objDate)) {
                    objDate=objDate.next().day();
                    if (objDate.compareTo(last)>-1) {
                        return false;
                    }
                }
            } else {
                
            }
            var user=customUser || defaultUser;
            var matrix=customMatrix || defaultMatrix;
            var dayIndex=objDate._getDayIndex();
            var day=days[dayIndex];
            if (day===undefined) return false;
            var schedule=schedules[day[1]]
            var letter=day[0];
            return {
                date:objDate,
                index:dayIndex,
                schedule:schedule,
                letter:letter,
                bells: function() {
                    var rtn=[];
                    var name, block, section;
                    //debug("schedule",schedule);
                    //debug("schedule.items",schedule.items);
                    for (var i in schedule.items) {
                        period=schedule.items[i];
                        bell={
                            name:period[0],
                            start:period[1],
                            len:period[2]
                        };
                        
                        //add block information to rotator, or empty block info
                        bell.block=user[matrix[letter][bell.name]] || {name:bell.name,moName:bell.name,block:-1};
                        
                        bell.end=bell.start+bell.len;
                        //human times
                        bell.Start=function(t){return (t<10*60?" ":"")+parseInt(t/60)+":"+parseInt(t % 60)}(bell.start)
                        bell.End=function(t){return (t<10*60?" ":"")+parseInt(t/60)+":"+parseInt(t % 60)}(bell.end)
                        rtn[rtn.length]=bell;
                    }
                    return rtn;
                },
                status: function(day, timeDateObj) {
                    rtn={}
                    
                }
            }
        }
    return {
        days:days,
        schedules:schedules,
        matrix: defaultMatrix,
        courses: defaultUser,
        isSchoolDay: isSchoolDay,
        day: day
        
    }
})();

tm=function anonymous(obj) {
    var __p=[],
        print=function(){__p.push.apply(__p,arguments);};
    with (obj||{}) {
        debug("bells()",bells())
        __p.push('\n        <ul class=\'day\'>\n                '); 
        _.each(bells(),function(b) {
                __p.push('\n                <ul>\n                    <li class="label">', b.name ,'</li>\n                    <li class="name">', b.block.name ,'</li>\n                    <li class="time">', b.start ,' - 14:20</li>\n                </ul>\n                '); 
            });
        __p.push('\n    ');}
    return __p.join('');
}


$(document).ready(function() {
    user = {
        name:"Chris D'Amato",
        0:{name:'Homeroom',block:0,moName:'TAG'},
        1:{name:'CD1 Physics First',block:1,moName:'1(A) 2(D) 3(C)',showInWeek:true},
        2:{name:'Study Hall',block:2,moName:'1(B) 2(A) 3(D)'},
        3:{name:'CD3 Physics H',block:3,moName:'1(C) 2(B) 3(A)',showInWeek:true},
        4:{name:'Library',block:4,moName:'1(D) 2(C) 3(B)'},
        5:{name:'Prep',block:5,moName:'5(A) 6(D) 7(C)',showInWeek:true},
        6:{name:'CD6 Physics First',block:6,moName:'5(B) 6(A) 7(D)',showInWeek:true},
        7:{name:'CD7 Physics First',block:7,moName:'5(C) 6(B) 7(A)',showInWeek:true},
        8:{name:'CD8 Physics First',block:8,moName:'5(D) 6(C) 7(B)',showInWeek:true},
        9:{name:'PLC',block:0,moName:'',showInWeek:true},
        }
    matrix=_.clone(mo.matrix);
    matrix[3].AM2=9;
    mo.userDay=function(date){return mo.day(date,user,matrix)};
    thisDay=mo.userDay(undefined);
    
    var mon=Date.parse(thisDay.date.toDateString());
    
    if (!mon.isWeekday()) {
        mon.next().mon();
    } else if (!mon.is().mon()) {
        mon.prev().mon();
    }
    
    var dayMaker=_.template($("#tmplDay").html());
    $("div#Day").html(dayMaker(thisDay));
    var weekMaker=_.template($("#tmplWeek").html());
    var $divWeek=$("div#Week");
    $divWeek.html(weekMaker(mo.userDay(mon)));
    $divWeek.append(weekMaker(mo.userDay(mon.next().day())));
    $divWeek.append(weekMaker(mo.userDay(mon.next().day())));
    $divWeek.append(weekMaker(mo.userDay(mon.next().day())));
    $divWeek.append(weekMaker(mo.userDay(mon.next().day())));
    
    
//    $("#div#status").html(today.now().description)
});
