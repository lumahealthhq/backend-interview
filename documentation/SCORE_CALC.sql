-- Score is calculate for an event on mysql called "tm_score_patients"
-- Event is set to operate each 5 secs a change avery row with score = null

BEGIN
	-- limits to calculate score 
	SET @age = 60;					-- more than x 1 pt
	SET @acceptedOffers = 0;		-- more than x get 3 pts
	SET @canceledOffers = 0;		-- less than x get 3 pts
	SET @averageReplyTime = 600;	-- less than x get 2 pts | given in sec | 600=10 min

	update tbl_patients set score = (
		if (age >= @age, 1, 0) +
		if (acceptedOffers > @acceptedOffers, 3, 0) +
		if (canceledOffers > @canceledOffers, 0, 3) +	
		if (averageReplyTime < @averageReplyTime, 2, 0)
	)where score is null or score = '';
END