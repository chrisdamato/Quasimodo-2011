(function(obj) {
var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('\n        <select id="selectProfile">\n            '); _each(models, function(model){  __p.push('\n                <option value="', model.attributes.id ,'">', model.attributes.name ,'</option>\n            ');  }); __p.push('\n        </select>\n    ');}return __p.join('');
})