import factory
import scoring
import unittest



class TestScoringFunctions(unittest.TestCase):

	def test_get_data_stats(self):
		data = [factory.gen_fake_patient() for x in range(10)]
		accepted_mean, accepted_std, canceled_mean, canceled_std, response_time_mean, response_time_std = scoring.get_data_stats(data)
		
		#means should be between min and max, standev should be non-negative
		self.assertTrue(0 <= accepted_mean <= 100)
		self.assertTrue(0 <= accepted_std)

		self.assertTrue(0 <= canceled_mean <= 100)
		self.assertTrue(0 <= canceled_std)

		self.assertTrue(0 <= response_time_mean <= 3600)
		self.assertTrue(0 <= response_time_std)


	def test_calculate_intrisic_score(self):
		data = [factory.gen_fake_patient() for x in range(10)]
		accepted_mean, accepted_std, canceled_mean, canceled_std, response_time_mean, response_time_std = scoring.get_data_stats(data)
		scored_data = scoring.calculate_intrinsic_score(data, accepted_mean, accepted_std, canceled_mean, canceled_std, response_time_mean, response_time_std)
		self.assertEqual(len(data), len(scored_data))
		#ensure every patient gets a pre-location score between 0 and 9
		for patient in scored_data:
			self.assertTrue("score" in patient)
			self.assertTrue(0 < patient["score"] <= 9.0)

	def test_calculate_final_score(self):
		data = [factory.gen_fake_patient() for x in range(100)]
		accepted_mean, accepted_std, canceled_mean, canceled_std, response_time_mean, response_time_std = scoring.get_data_stats(data)
		scored_data = scoring.calculate_intrinsic_score(data, accepted_mean, accepted_std, canceled_mean, canceled_std, response_time_mean, response_time_std)
		self.assertEqual(len(data), len(scored_data))
		location = factory.gen_fake_location()
		res = scoring.final_score(location, scored_data)
		#ensure length is expected 10
		self.assertEqual(len(res), 10)
		#ensure scores between 1 and 10
		self.assertTrue(max([r["score"] for r in res]) <= 10)
		self.assertTrue(min([r["score"] for r in res]) >= 1)
		
		#ensure max element at front of list and min element at end
		self.assertEqual(max([r["score"] for r in res]), res[0]["score"])
		self.assertEqual(min([r["score"] for r in res]), res[-1]["score"])

		#score everything to ensure all scores are between 1 and 10 and best at front (scores may vary between here and above due to randomness)
		all_scores = scoring.final_score(location, scored_data, n=100)
		self.assertTrue(max([r["score"] for r in all_scores]) <= 10)
		self.assertTrue(min([r["score"] for r in all_scores]) >= 1)

		self.assertEqual(max([r["score"] for r in all_scores]), all_scores[0]["score"])
		self.assertEqual(min([r["score"] for r in all_scores]), all_scores[-1]["score"])

if __name__ == '__main__':
    unittest.main()