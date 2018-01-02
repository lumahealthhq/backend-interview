var should = require('chai').should(),
    luma_priority = require('../index');

describe('#luma_priority', function() {
  it('ping', function() {
    luma_priority.ping().should.equal('pong');
  });

  it('distance in mile', function() {
    luma_priority.getDistanceInMile(
      {
        "latitude": "46.7110",
        "longitude": "-63.1150"
      },
      {
        "latitude": "-81.0341",
        "longitude": "144.9963"
      }
    )
    .should.equal(9989);
  });

});

describe('#scoring Age', function() {
  it('age 21 is the lowest (score=1)', function() {
    luma_priority.scoreAge(21).should.equal(1);
  });

  it('age 90 is the highest (score=10)', function() {
    luma_priority.scoreAge(90).should.equal(10);
  });

  it('age 28 is (score=2)', function() {
    luma_priority.scoreAge(28).should.equal(2);
  });

});

describe('#scoring AcceptedOffers', function() {
  it('acceptedOffers 0 is the lowest (score=1)', function() {
    luma_priority.scoreAcceptedOffers(0).should.equal(1);
  });

  it('acceptedOffers 100 is the highest (score=10)', function() {
    luma_priority.scoreAcceptedOffers(100).should.equal(10);
  });

  it('acceptedOffers 11 is (score=2)', function() {
    luma_priority.scoreAcceptedOffers(11).should.equal(2);
  });
});

describe('#scoring CanceledOffers', function() {
  it('canceledOffers 0 is the highest (score=10)', function() {
    luma_priority.scoreCanceledOffers(0).should.equal(10);
  });

  it('canceledOffers 100 is the lowest (score=1)', function() {
    luma_priority.scoreCanceledOffers(100).should.equal(1);
  });

  it('canceledOffers 11 is (score=9)', function() {
    luma_priority.scoreCanceledOffers(11).should.equal(9);
  });
});

describe('#scoring AverageReplyTime', function() {
  it('averageReplyTime 3600 is the lowest (score=1)', function() {
    luma_priority.scoreAverageReplyTime(3600).should.equal(1);
  });

  it('averageReplyTime 1 is the highest (score=10)', function() {
    luma_priority.scoreAverageReplyTime(1).should.equal(10);
  });

  it('averageReplyTime 361 is (score=9)', function() {
    luma_priority.scoreAverageReplyTime(361).should.equal(9);
  });
});

describe('#scoring Distance', function() {
  it('distance 0 mile is the highest (score=10)', function() {
    luma_priority.scoreDistance(0).should.equal(10);
  });

  it('canceledOffers 10 miles is the lowest (score=1)', function() {
    luma_priority.scoreDistance(10).should.equal(1);
  });

  it('canceledOffers 11 miles is (score=1)', function() {
    luma_priority.scoreDistance(11).should.equal(1);
  });
});

describe('#scoring Patient', function() {
  it('patient with the highest (score=10)', function() {
    luma_priority.scorePatient(
      {
        "id": "541d25c9-9500-4265-8967-240f44ecf723",
        "name": "Samir Pacocha",
        "location": {
          "latitude": "46.7110",
          "longitude": "-63.1150"
        },
        "age": 90,
        "acceptedOffers": 100,
        "canceledOffers": 0,
        "averageReplyTime": 1
      },
      {
        "latitude": "46.7110",
        "longitude": "-63.1150"
      }
    ).should.equal(10);
  });

  it('patient with the lowest (score=1)', function() {
    luma_priority.scorePatient(
      {
        "id": "41fd45bc-b166-444a-a69e-9d527b4aee48",
        "name": "Bernard Mosciski",
        "location": {
          "latitude": "-81.0341",
          "longitude": "144.9963"
        },
        "age": 21,
        "acceptedOffers": 0,
        "canceledOffers": 100,
        "averageReplyTime": 3600
      },
      {
        "latitude": "46.7110",
        "longitude": "-63.1150"
      }
    ).should.equal(1);
  });
});
