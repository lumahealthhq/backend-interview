export const  computePatientScore = (patient) => {
  const demographicWeight = 0.1;
  const behavioralWeight = 0.3;

  const demographicScore = (patient.age *  0.1);
  const behavioralScore = (patient.acceptedOffers - patient.canceledOffers) * 0.3 + ( 1 - patient.averageReplyTime / 3600) * 10;
  const totalScore = (demographicScore * demographicWeight) + (behavioralScore * behavioralWeight);

  return totalScore.toFixed(2);
};