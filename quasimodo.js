$(document).ready(function() {

window.serverTimeAdjustment=0
jQuery.ajax({
    type: "POST",    
    url:  "server-time.php",
    dataType: 'json',
    data: {
        data: {postTime: parseInt((new Date()).getTime()/1000)} 
        },
    success: function( data ) {
        data.returnTime=parseInt((new Date()).getTime()/1000)
        console.log("ajax server time data",data)
    }
})


window.ModelSingleBell=Backbone.Model.extend({
    //a bell is the unit presented to the user: start, end, name, label
    initialize: function() {
    },
    defaults: function() { 
        return {
        }
    }
})
window.CollectionBells=Backbone.Collection.extend({
    //a collection that backs the bell schedule displayed to the user for a school day
    model:  ModelSingleBell,
})

window.ModelBellSchedule=Backbone.Model.extend({
    initialize: function() {
        this.bind("change:date",this.changeDate, this);
        this.bind("change:letter",this.updateBells, this);
        this.bind("change:schedule",this.updateBells, this);
        this.bind("change:profile",this.updateBells, this);
        this.set({
            date: MO.thisSchoolDay(),
            // ModelProfile: window.defaultProfile,
            bells: new CollectionBells,
            }, {silent: true} )
        this.setLetterAndScheduleFromSchoolCalendar();
        this.updateBells();
    },
    offsetSchoolDay: function(offset) {
        offset=parseInt(offset) || 1;
        var nxDate=this.get('date').clone().add({days:offset})
        while (!MO.isSchoolDay(nxDate)) {
            nxDate.add({days:offset});
            if (nxDate.getYear()>2014) {throw "Date problem"}
        }
        this.set({date:nxDate});
    },
    changeDate: function() {
        this.setLetterAndScheduleFromSchoolCalendar();
        this.updateBells();
    },
    setLetterAndScheduleFromSchoolCalendar: function() {
        var date=this.attributes.date || MO.thisSchoolDay()
        this.set ( {
            date: date,
            schedule: MO.getSchedule(date),
            letter: MO.getLetter(date),
            Letter: ['','A','B','C','D'][MO.getLetter(date)],
        }, {silent: true} );
    },
    updateBells: function() {
        var rtn=[];
        var name, block, section;
        var date=this.get("date")
        var schedule=this.get("schedule")
        var profileModel=this.get("profile")
        var letter=this.get("letter")
        if (_.isUndefined(profileModel)) {
            return
        }
        var profile=profileModel.attributes;
        var bells=new CollectionBells() //a collection of ModelSingleBell objects now
        for (var i in schedule.items) {
            period=schedule.items[i];
            name=period[0];
            
            var bell = new ModelSingleBell ({
                name:   name,
                start:  date.clone().clearTime().addMinutes(period[1]),
                len:    period[2],
                block:  profile.user[profile.matrix[letter][name]] //block by rotator from user info
                        || profile.user[name] // or fixed block from user info
                        || {name:name, block:-1}, //or a fake non-block
                order:  bells.length+1,
                profile: profileModel
            });
            bell.set({end:bell.get("start").clone().addMinutes(bell.get('len'))})
            bells.add(bell)
        }
        this.set({'bells':bells});
        return bells;
    },
    status: function(day, timeDateObj) {
        rtn={}        
    }
})


window.ViewBellSchedule = Backbone.View.extend({
    tagName: "div",
    model: ModelBellSchedule,
    events: {
        // "click .letterAndSchedule"     : "incrementSchedule",
        // "dblclick .name"               : "editBlock"
        "click .prev" : "prev",
        "click .next" : "next",
        "keypress"    : "keyhandle"

        },
    initialize: function() {
        this.model.bind("change", this.render, this);

        },
    render: function() {
        var html=_.template($("#schedule-heading-template").html(),this.model.toJSON());
        $(this.el).html(html);
        _.each(this.model.get('bells').models,function(model) {
            // var newEl=$("")
            var view=new ViewSingleBell ( { model:model } );
            this.$("table").append(view.render().el)
            }
            , this
        )
        return this;
        },
    next: function() {
        this.model.set({date:this.model.get('date').clone().next().day()})
    },
    prev: function() {
        this.model.set({date:this.model.get('date').clone().prev().day()})
    },
    keyhandle: function(e) {
        console.log(e.keyCode)
    }
    })
    
window.ViewSingleBell = Backbone.View.extend({
    tagName: "tr",
    template: _.template($("#bell-item").html()),
    events: {
        "dblclick .name" : "edit",
        "touchend" : "edit",
        "keypress .name-edit"      : "updateOnEnter",
    },
    initialize: function() {
        this.model.bind("change", this.render, this)
    },
    render: function() {
        var block=this.model.get('block');
        $(this.el)
            .html( this.template( this.model.toJSON() ) )
            .attr( "class", "bell-item " +  
                (block.block>0 
                    ? "block block"+block.block 
                    : block.name.replace(" ","_")
                ) 
            )
        // this.el=$( this.template( this.model.toJSON() ) );
        this.input = this.$('input');
        this.input.bind('blur', _.bind(this.close, this)).val(block.name);
        return this;
    },
    foo: function() {
        alert("ding")
    },
    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },
    close: function() {
      this.model.get('block').name=this.input.val();
      this.model.change();
      $(this.el).removeClass("editing");
      this.model.get('profile').save();
      console.log(this.model)
    },
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },
   

})

window.ModelProfile=Backbone.Model.extend({
    localStorage: new Store('profile')

    })

defaultProfile=new ModelProfile(MO.defaultProfile());
//Profiles.add(defaultProfile);
//also preload my ModelProfile
chrisProfile = new ModelProfile(MO.defaultProfile());
chrisProfile.set({
    name:"Chris D'Amato",
    id:"Chris DAmato",
    user: {
        name:"Chris D'Amato",
        0:{name:'',block:0,altName:''},
        1:{name:'Physics First 1',block:1,altName:'',showInWeek:true},
        2:{name:'Study Hall',block:2,altName:''},
        3:{name:'Physics 3',block:3,altName:'',showInWeek:true},
        4:{name:'Library',block:4,altName:''},
        'Lunch': {name:'',block:-1,altName:'',showInWeek:true},
        5:{name:'Prep',block:5,altName:'',showInWeek:true},
        6:{name:'Physics First 6',block:6,altName:'',showInWeek:true},
        7:{name:'Physics First 7',block:7,altName:'',showInWeek:true},
        8:{name:'Physics First 8',block:8,altName:'',showInWeek:true},
        9:{name:'PLC',block:9,altName:'',showInWeek:true},
        'STAR':{name:'STAR',block:-1,altName:'',showInWeek:true},
        },
    });
chrisProfile.attributes.matrix[3].AM2=9;

chrisProfile.fetch();

modelSimple=new ModelBellSchedule({profile:chrisProfile});

viewSimple=new ViewBellSchedule({model: modelSimple, el:document.getElementById('simple')}).render();

// app=new QuasimodoView;

//thisweekModel=new window.WeekModel();

//    viewPlanner=new PlannerView( {
//       model: thisWeekModel,
//      el: $("#thisWeek")
// })
//viewPlanner.render()
    
});
