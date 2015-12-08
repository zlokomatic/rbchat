module.exports = function(robot) {
  var keyname = 'keys5';
  keynameno = 'keyno';

  robot.hear(/^!cd(\d)(.*)/i, function(res) {
    var key, keys;
    key = res.match[2].trim();
    robot.logger.info(key);
    keys = robot.brain.get(keynameno + res.match[1]) || {};
    if (typeof keys[key] === 'undefined') {
      keys[key] = 0;
    }
    keys[key]++;
    robot.brain.set(keyname, keys);
    return robot.logger.debug('HEY', key, keys);
  });

  robot.hear(/^!cd\s(.*)/i, function(res) {
    var key, keys;
    key = res.match[1].trim();
    robot.logger.info(key);
    keys = robot.brain.get(keyname) || {};
    if (typeof keys[key] === 'undefined') {
      keys[key] = 0;
    }
    keys[key]++;
    robot.brain.set(keyname, keys);
    return robot.logger.debug('HEY', key, keys);
  });

  robot.hear(/^!cdstats (\w+) (\w+)/i, function(res) {
    var key1 = res.match[1];
    var key2 = res.match[2];
    var cntstats1 = 0;
    var cntstats2 = 0;

    keys = robot.brain.get(keyname) || {};
    
    cntstats1 = keys[key1] || 0;
    cntstats2 = keys[key2] || 0;

    var cntoverall = cntstats1 + cntstats2;
    var stats1 = (cntstats1*100) / cntoverall;
    var stats2 = (cntstats2*100) / cntoverall;

    res.send("STATS " + key1 + ": " + stats1 + " - " + key2 + ": " + stats2);
    return robot.logger.debug('STATS', key, keys);
  });

  robot.hear(/^!cdstats (\d)/i, function(res) {
    var key1 = res.match[1];
    var key2 = res.match[2];
    var cntstats1 = 0;
    var cntstats2 = 0;

    keys = robot.brain.get(keynameno) || {};
    
    return robot.logger.debug('STATS', key, keys);
  });
};
