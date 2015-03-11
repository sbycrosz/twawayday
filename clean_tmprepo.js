var rmdir = require('rimraf'),
    tmpDirectory = require('os').tmpDir(),
    tmpRepoDirectory = tmpDirectory + 'tmpRepo';

rmdir(tmpRepoDirectory, function(error){})
