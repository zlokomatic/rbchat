'use strict';

module.exports = function(robot) {
  var keyskey = 'keystest';
  var keynameno = null;

  var getLastKey = function(){
      var lastkeys = JSON.parse(robot.brain.get(keyskey)) || [];
      var lastkey = null;
      if(lastkeys.length){
        lastkey = lastkeys.pop();
      }

      return lastkey;
  }
  robot.hear(/^!cdstatus/i, function(res) {
      robot.logger.debug('KEY', getLastKey());
  });


  robot.hear(/^!cdstart\s(.*)/i, function(res) {
     var keyname = res.match[1];
     var keynameno = res.match[1];

     var keys = JSON.parse(robot.brain.get(keyskey)) || [];
     keys.push(keyname);
     robot.brain.set(keyskey, JSON.stringify(keys));
  });

  /* !cd word */
  robot.hear(/^!cd\s(.*)/i, function(res) {
    var keyname = getLastKey();
    var key, keys;
    key = res.match[1].trim().toLowerCase();
    robot.logger.info(key);
    keys = robot.brain.get(keyname) || {};
    if (typeof keys[key] === 'undefined') {
      keys[key] = 0;
    }
    keys[key]++;
    //robot.logger.debug('SET CD', keyname, keys);

    robot.brain.set(keyname, keys);
  });

  robot.hear(/^!cdstats (\w+) (\w+)/i, function(res) {
    var keyname = getLastKey();
    var key1 = res.match[1].trim().toLowerCase();
    var key2 = res.match[2].trim().toLowerCase();
    var cntstats1 = 0;
    var cntstats2 = 0;

    var keys = robot.brain.get(keyname) || {};

robot.logger.debug('STATS', keys);
    cntstats1 = keys[key1] || 0;
    cntstats2 = keys[key2] || 0;

    var cntoverall = cntstats1 + cntstats2;
    var stats1 = (cntstats1*100) / cntoverall;
    var stats2 = (cntstats2*100) / cntoverall;

    res.send("STATS");
    res.send(key1 + " -> " + cntstats1 + " ( " + stats1.toFixed() + "% )");
    res.send(key2 + " -> " + cntstats2 + " ( " + stats2.toFixed() + "% )");
  });

  robot.hear(/^!cdstatstop (\d+)/i, function(res) {
    var keyname = getLastKey();

    var list = [];
    var keys = robot.brain.get(keyname) || {};
    robot.logger.debug('STATS', keys);

    var c = Object.keys(keys);
    for(var i in c){
        var name = c[i];

        var pos = list.map(function(a){ return a.name }).indexOf(name);
        if(pos !== -1){
            list[pos].cnt += keys[name];
        }
        else{
            list.push({ name: name.trim().toLowerCase(), cnt: keys[name]});
        }
    }

    list = list.sort(function(a,b){
        robot.logger.debug('BLA', a.cnt, b.cnt);
        return b.cnt - a.cnt;
    }).slice(0, res.match[1]);

    var cntoverall = 0;
    for(i in list){
        var top = list[i];
        cntoverall += top.cnt;
    }
    res.send('TOPLIST');
    for(i in list){
        var top = list[i];
        var stats = (top.cnt*100) / cntoverall;
        res.send(top.name + " -> " + top.cnt + " ( " + stats.toFixed(2) + "% )");
    }
  });

  robot.hear(/^!cdstats(\d) (.*)/i, function(res) {
    var keyname = getLastKey();
    var key = res.match[1];
    var cntstats1 = 0;
    var cntstats2 = 0;

    var keys = robot.brain.get(keyname + res.match[1]) || {};

    return robot.logger.debug('STATS', key, keys, keyname);
  });

  /* !cd1 bla */
  robot.hear(/^!cd(\d) (.*)/i, function(res) {
    var keyname = getLastKey() + res.match[1];
    var key, keys;
    key = res.match[2].trim();
    robot.logger.info(key);
    keys = robot.brain.get(keyname) || {};
    if (typeof keys[key] === 'undefined') {
      keys[key] = 0;
    }
    keys[key]++;

    robot.logger.debug('STATS', key, keys, keyname);
    robot.brain.set(keyname, keys);
  });
};
