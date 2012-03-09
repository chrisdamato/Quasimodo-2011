(function(global){

    global.Date.prototype.getLetter = function() {
        var rtn;
        (rtn = MO.letters[this.getYear()+1900]) 
            && ( rtn = rtn[this.getMonth()+1] ) 
            && ( rtn = rtn[this.getDate()] )
            && ( rtn = [ ["N","A","B","C","D"][rtn], rtn ] );
        return rtn;
    }

    global.Date.prototype.getSchedule = function() {
        var rtn;
        (rtn = MO.schedules[this.getYear()+1900]) 
            && ( rtn = rtn[this.getMonth()+1] ) 
            && ( rtn = rtn[this.getDate()] )
            && ( rtn = MO.scheduleTypes[rtn] );
        return rtn;
    }

    global.Date.prototype.isSchoolDay = function () {
        return (!!this.getLetter()) && (!!this.getSchedule());
    }

    global.Date.prototype.getBells = function (optionalProfile) {
        /*
        bells = Array of : { period: "AM1", name: "B2", start: (date), end: (date), length: (min), block: {...}  }
        */
        var profile = optionalProfile || MO.defaultProfile;
        var letter = this.getLetter();
        var schedule = this.getSchedule();

        if ( !profile || !letter || !schedule ) { return; }

        var bells=[];
        for (p in schedule.periods) {
            period = schedule.periods[p];
            b = bells[p] = {};
            b.period = period[MO.scheduleTypes.NAME];
            b.name = profile.matrix[letter[1]][b.period] || b.period;
            b.block = profile.blocks[b.name];
            b.start = this.clone().clearTime()
                      .add(period[MO.scheduleTypes.START_HOUR]).hours()
                      .add(period[MO.scheduleTypes.START_MINUTE]).minutes();
            b.length = period[MO.scheduleTypes.LENGTH];
            b.end = b.start.clone().add(b.length).minutes();
        }
        return bells;
    }

    global.Date.prototype.getStatus = function() {
        var bells = this.getBells();
        if (!bells) {return null}
        var status = {}
        bells.forEach(function(bell) {
            var started = (this.compareTo( bell.start ) >= 0);
            var ended = (this.compareTo( bell.end ) >= 0);
            (started && !ended) && (status.now = bell);
            (!started && !status.next) && (status.next = bell);
        }, this)
        if (status.now) {
            status.until = parseInt((status.now.end - this) /1000 /60 + 1);
            status.description = "-" + status.until + " end of "+ status.now.period;
        } else if (status.next) {
            status.until = parseInt((status.next.start - this)/1000/60);
            status.description = "-" + status.until +"start of "+ status.next.period;
        }
        return status.until ? status : {description: "School is out"} 
    };
}) ( typeof global == "undefined" ? this : global );


/*

Create the global MO object:
	
	block: a section of a course, or other subject/duty. Ex: 21 Students in 4(A) Freshman Physics CP

	period: a unit of the day's time allocation. Ex: AM1, Lunch, Star, Tag, PM3

	scheduleType: a bell schedule like Normal or Star PM which includes a list of periods and their times

*/


(function(global) {
	global.MO = {
		/*

		profile: all the information needed to customize a bell schedule display for a particular user

		*/
	    defaultProfile: {
            profileTitle: 'Default',
            blocks: {
                B1:{name:'Block 1',title:"",description:'1(A) 2(D) 3(C)',showInWeek:true},
                B2:{name:'Block 2',title:"",description:'1(B) 2(A) 3(D)',showInWeek:true},
                B3:{name:'Block 3',title:"",description:'1(C) 2(B) 3(A)',showInWeek:true},
                B4:{name:'Block 4',title:"",description:'1(D) 2(C) 3(B)',showInWeek:true},
                B5:{name:'Block 5',title:"",description:'5(A) 6(D) 7(C)',showInWeek:true},
                B6:{name:'Block 6',title:"",description:'5(B) 6(A) 7(D)',showInWeek:true},
                B7:{name:'Block 7',title:"",description:'5(C) 6(B) 7(A)',showInWeek:true},
                B8:{name:'Block 8',title:"",description:'5(D) 6(C) 7(B)',showInWeek:true},
            },
            matrix: {
                //letter:[ periodName: blockName, ... ]
                1:{AM1:"B1",AM2:"B2",AM3:"B3",PM1:"B5",PM2:"B6",PM3:"B7"},
                2:{AM1:"B2",AM2:"B3",AM3:"B4",PM1:"B6",PM2:"B7",PM3:"B8"},
                3:{AM1:"B3",AM2:"B4",AM3:"B1",PM1:"B7",PM2:"B8",PM3:"B5"},
                4:{AM1:"B4",AM2:"B1",AM3:"B2",PM1:"B8",PM2:"B5",PM3:"B6"}
            }
        },
        /*

		The information below should only need to be set up once per year
		
        */
	    scheduleTypes: {
	        /* The following item names will be interpreted specially:
	            AM1 .. PM3
	            B1 .. BF
	            TAG
	            Lunch
	            Star
	            */
	        NAME: 0,
	        START_HOUR: 1,
	        START_MINUTE: 2,
	        LENGTH:3,
	        0: { name:'None',periods:[] },
	        1: { name:'Normal', periods:[
	            /* item format
	            ['name',startHour, startMinute, lengthMinutes]
	            */
	            [ 'TAG',     7, 17, 10 ], 
	            [ 'AM1',     7, 32, 52 ], 
	            [ 'AM2',     8, 29, 65 ], 
	            [ 'AM3',     9, 39, 52 ], 
	            [ 'Lunch',  10, 31, 45 ], 
	            [ 'PM1',    11, 21, 52 ], 
	            [ 'PM2',    12, 18, 64 ], 
	            [ 'PM3',    13, 28, 52 ]
	        ]},
	        2: { name:'STAR AM', periods:[
	            [ 'TAG',    7, 17, 3  ], 
	            [ 'AM1',    7, 26, 50 ], 
	            [ 'STAR',   8, 21, 29 ], 
	            [ 'AM2',    8, 51, 57 ], 
	            [ 'AM3',    9, 53, 50 ], 
	            [ 'Lunch', 10, 43, 45 ], 
	            [ 'PM1',   11, 33, 49 ], 
	            [ 'PM2',   12, 28, 57 ], 
	            [ 'PM3',   13, 30, 50 ]
	        ]},
	        3: { name:'STAR PM', periods:[
	            [ "TAG", 7, 17, 3 ],
	            [ "AM1", 7, 26, 50 ],
	            [ "AM2", 8, 21, 57 ],
	            [ "AM3", 9, 23, 50 ],
	            [ "Lunch", 10, 13, 45 ],
	            [ "PM1", 11, 3, 50 ],
	            [ "STAR", 11, 58, 30 ],
	            [ "PM2", 12, 28, 57 ],
	            [ "PM3", 13, 30, 50 ]
	        ]},
	        4: { name:'Short 6', periods:[
	            [ "TAG", 7, 17, 9 ],
	            [ "AM1", 7, 31, 34 ],
	            [ "AM2", 8, 10, 34 ],
	            [ "AM3", 8, 49, 34 ],
	            [ "PM1", 9, 28, 34 ],
	            [ "PM2", 10, 7, 34 ],
	            [ "PM3", 10, 46, 34 ]
	        ]},
	        5: { name:'Delay', periods:[
	            [ "TAG", 9, 17, 6 ],
	            [ "AM1", 9, 28, 37 ],
	            [ "AM2", 10, 10, 37 ],
	            [ "AM3", 10, 52, 37 ],
	            [ "Lunch", 11, 29, 45 ],
	            [ "PM1", 12, 19, 36 ],
	            [ "PM2", 13, 1, 36 ],
	            [ "PM", 13, 43, 37 ]
	            ]},
	        6: { name:'Activity', periods:[
	            [ "TAG", 7, 17, 10 ],
	            [ "AM1", 7, 32, 48 ],
	            [ "AM2", 8, 25, 48 ],
	            [ "AM3", 9, 18, 48 ],
	            [ "Lunch", 10, 6, 45 ],
	            [ "PM1", 10, 56, 48 ],
	            [ "PM2", 11, 49, 48 ],
	            [ "PM3", 12, 42, 48 ],
	            [ "Activity", 13, 35, 45 ]
	        ]},
	        7: { name:'Short 8', periods:[
	            [ "TAG", 7, 17, 11 ],
	            [ "B1", 7, 33, 24 ],
	            [ "B2", 8, 2, 24 ],
	            [ "B3", 8, 31, 24 ],
	            [ "B4", 9, 0, 24 ],
	            [ "B5", 9, 29, 24 ],
	            [ "B6", 9, 58, 24 ],
	            [ "B7", 10, 27, 24 ],
	            [ "B8", 11, 56, 24 ]
	        ]},
	        8: { name:'BTS', periods:[
	            [ "Welcome", 18, 45, 15 ],
	            [ "TAG", 19, 5, 5 ],
	            [ "B1", 19, 15, 10 ],
	            [ "B2", 19, 30, 10 ],
	            [ "B3", 19, 45, 10 ],
	            [ "B4", 20, 0, 10 ],
	            [ "B5", 20, 15, 10 ],
	            [ "B6", 20, 30, 10 ],
	            [ "B7", 20, 45, 10 ],
	            [ "B8", 21, 0, 10 ]
	            ]},
	        9: { name:'Finals', periods:[
	            ['Exam1',7,30,120], 
	            ['Exam2',9,40,120]
	            ]},
	        10: { name:'Testing', periods:[
	            [ "Testing", 7, 17, 198 ],
	            [ "Lunch", 10, 35, 45 ],
	            [ "B1", 11, 25, 40 ],
	            [ "B2", 12, 10, 40 ],
	            [ "B3", 12, 55, 40 ],
	            [ "B4", 13, 40, 40 ]
	            ]},
	        11: { name:'Full day 8', periods:[
	            [ "TAG", 7, 17, 18 ],
	            [ "B1", 7, 40, 40 ],
	            [ "B2", 8, 25, 40 ],
	            [ "B3", 9, 10, 40 ],
	            [ "B4", 9, 55, 40 ],
	            [ "Lunch", 10, 35, 45 ],
	            [ "B5", 11, 25, 40 ],
	            [ "B6", 12, 10, 40 ],
	            [ "B7", 12, 55, 40 ],
	            [ "B8", 13, 40, 40 ]
	            ]},
	        12: { name: 'Midterms', periods:[
	            ['TAG',437,8], 
	            ['B1 Exam', 7,30, 90], 
	            ['B2 Exam',9,10, 90], 
	            ['Lunch',10,40, 50], 
	            ['B5',11,30, 45], 
	            ['B6',12,20, 45]
	            ]},
	        13: { name: 'Midterms', periods:[
	            ['TAG',437,8], 
	            ['B3 Exam', 7,30, 90], 
	            ['B4 Exam',9,10, 90], 
	            ['Lunch',10,40, 50], 
	            ['B7',11,30, 45], 
	            ['B8',12,20, 45]
	            ]},
	        14: { name: 'Midterms', periods:[
	            ['TAG',437,8], 
	            ['B5 Exam', 7,30, 90], 
	            ['B6 Exam',9,10, 90], 
	            ['Lunch',10,40, 50], 
	            ['B1',11,30, 45], 
	            ['B2',12,20, 45]
	            ]},
	        15: { name: 'Midterms', periods:[
	            ['TAG',437,8], 
	            ['B7 Exam', 7,30, 90], 
	            ['B8 Exam',9,10, 90], 
	            ['Lunch',10,40, 50], 
	            ['B3',11,30, 45], 
	            ['B4',12,20, 45]
	            ]},
	        16: { name: 'HSPA', periods:[
	            ['HSPA Testing', 7,17, 180+18], 
	            ['Lunch',10,35, 50], 
	            ['B1',11,25, 55], 
	            ['B2',12,25, 55], 
	            ['B3',13,25, 55]
	            ]},
	        17: { name: 'HSPA', periods:[
	            ['HSPA Testing', 7,17, 180+18], 
	            ['Lunch',10,35, 50], 
	            ['B5',11,25, 55], 
	            ['B6',12,25, 55], 
	            ['B7',13,25, 55]
	            ]},
	        18: { name: 'HSPA', periods:[
	            ['HSPA Testing', 7,17, 180+18], 
	            ['Lunch',10,35, 50], 
	            ['B4',11,25, 55], 
	            ['B4',12,25, 55], 
	            ['B8',13,25, 55]
	            ]}
	    	},
		schedules: {
		    /*
		    year: {
		        month: {date: scheduleType, date: scheduleType }
		    }
		    */
		    2011:{
		        9:{ 6:11, 7:1, 8:1, 9:1, 12:1, 13:1, 14:1, 15:3, 16:1, 19:1, 20:2, 21:1, 22:3, 23:1, 26:1, 27:2, 28:1, 30:1 },
		        10:{ 3:1, 4:2, 5:1, 6:6, 7:1, 11:2, 12:1, 13:3, 14:1, 17:1, 18:2, 19:1, 20:3, 21:1, 24:1, 25:2, 26:1, 27:3, 28:1, 31:1 },
		        11:{ 1:2, 2:1, 3:1, 4:1, 6:1, 8:2, 9:1, 14:1, 15:2, 16:1, 17:3, 18:1, 21:1, 22:2, 28:1, 29:2, 30:1 },
		        12:{ 1:3, 2:1, 5:1, 6:2, 7:1, 8:3, 9:1, 12:1, 13:2, 14:1, 15:3, 16:1, 19:1, 20:2, 21:1, 22:3, 23:1 }
		    },
		    2012:{
		        1:{ 3:2, 4:1, 5:3, 6:1, 9:1, 10:2, 11:1, 12:3, 13:1, 17:2, 18:1, 19:3, 20:1, 23:12, 24:13, 25:14, 26:15, 27:1, 30:1, 31:2 },
		        2:{ 1:1, 2:3, 3:1, 6:1, 7:2, 8:1, 9:3, 10:1, 13:1, 14:2, 15:1, 16:3, 17:1, 22:1, 23:3, 24:1, 27:1, 28:2, 29:1 },
		        3:{ 1:3, 2:1, 5:1, 6:16, 7:17, 8:18, 9:1, 12:1, 13:2, 14:1, 15:3, 16:1, 19:1, 20:2, 21:1, 22:3, 23:1, 26:1, 27:2, 28:1, 29:3, 30:1 },
		        4:{ 10:2, 11:1, 12:3, 13:1, 16:1, 17:2, 18:1, 19:3, 20:1, 23:1, 24:2, 25:1, 26:3, 27:1, 30:1 },
		        5:{ 1:2, 2:1, 3:3, 4:1, 7:1, 8:2, 9:1, 10:3, 11:1, 14:1, 15:2, 16:1, 17:3, 18:1, 21:1, 22:2, 23:1, 24:3, 25:1, 29:2, 30:1, 31:3 },
		        6:{ 1:1, 4:1, 5:2, 6:1, 7:3, 8:1, 11:1, 12:2, 13:1, 14:3, 15:1, 18:1, 19:2, 20:1, 21:3, 22:1 }
		    }
		   },
		letters : {
		    /*
		    year: {
		        month: {date: letter, date: letter }
		    }
		    */
		    2011: {
		        9:{ 6:1, 7:2, 8:3, 9:4, 12:1, 13:2, 14:3, 15:4, 16:1, 19:2, 20:3, 21:4, 22:1, 23:2, 26:3, 27:4, 28:1, 30:2 },
		        10:{ 3:3, 4:4, 5:1, 6:2, 7:3, 11:4, 12:1, 13:2, 14:3, 17:4, 18:1, 19:2, 20:3, 21:4, 24:1, 25:2, 26:3, 27:4, 28:1, 31:2 },
		        11:{ 1:3, 2:4, 3:1, 4:2, 6:3, 8:4, 9:1, 14:2, 15:3, 16:4, 17:1, 18:2, 21:3, 22:4, 28:1, 29:2, 30:3 },
		        12:{ 1:4, 2:1, 5:2, 6:3, 7:4, 8:1, 9:2, 12:3, 13:4, 14:1, 15:2, 16:3, 19:4, 20:1, 21:2, 22:3, 23:4 }
		    },
		    2012:{
		        1:{ 3:1, 4:2, 5:3, 6:4, 9:1, 10:2, 11:3, 12:4, 13:1, 17:2, 18:3, 19:4, 20:1, 23:2, 24:3, 25:4, 26:1, 27:2, 30:3, 31:4 },
		        2:{ 1:1, 2:2, 3:3, 6:4, 7:1, 8:2, 9:3, 10:4, 13:1, 14:2, 15:3, 16:4, 17:1, 22:2, 23:3, 24:4, 27:1, 28:2, 29:3 },
		        3:{ 1:4, 2:1, 5:2, 6:3, 7:4, 8:1, 9:2, 12:3, 13:4, 14:1, 15:2, 16:3, 19:4, 20:1, 21:2, 22:3, 23:4, 26:1, 27:2, 28:3, 29:4, 30:1 },
		        4:{ 10:2, 11:3, 12:4, 13:1, 16:2, 17:3, 18:4, 19:1, 20:2, 23:3, 24:4, 25:1, 26:2, 27:3, 30:4 },
		        5:{ 1:1, 2:2, 3:3, 4:4, 7:1, 8:2, 9:3, 10:4, 11:1, 14:2, 15:3, 16:4, 17:1, 18:2, 21:3, 22:4, 23:1, 24:2, 25:3, 29:4, 30:1, 31:2 },
		        6:{ 1:3, 4:4, 5:1, 6:2, 7:3, 8:4, 11:1, 12:2, 13:3, 14:4, 15:1, 18:2, 19:3, 20:4, 21:1, 22:2 }
		    }
	    	},
    }	
})(typeof exports != 'undefined' ? exports : this);