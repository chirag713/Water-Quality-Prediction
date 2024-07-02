import axios from 'axios';

const API_KEY = 'fh3c-iGWuo91Ibmbz_oYy4orKtfKS45UXfFqY9zWI2D2';

const getToken = async () => {
    try {
        const response = await axios.post('https://iam.cloud.ibm.com/identity/token', null, {
            params: {
                'apikey': API_KEY,
                'grant_type': 'urn:ibm:params:oauth:grant-type:apikey'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.status === 200) {
            return response.data.access_token;
        } else {
            throw new Error('Failed to get token');
        }
    } catch (error) {
        throw new Error('Error getting token: ' + error.message);
    }
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { ph, hardness, solids, chloramines, sulfate, conductivity, organic_carbon, trihalomethanes, turbidity } = req.body;

        console.log(ph, hardness, solids, chloramines, sulfate, conductivity, organic_carbon, trihalomethanes, turbidity);

        const mltoken = await getToken();

        const payloadScoring = {
            input_data: [
                {
                    fields: ["ph", "Hardness", "Solids", "Chloramines", "Sulfate", "Conductivity", "Organic_carbon", "Trihalomethanes", "Turbidity"],
                    values: [
                        [parseFloat(ph), parseFloat(hardness), parseFloat(solids), parseFloat(chloramines), parseFloat(sulfate), parseFloat(conductivity), parseFloat(organic_carbon), parseFloat(trihalomethanes), parseFloat(turbidity)]
                    ]
                }
            ]
        };

        try {
            const responseScoring = await axios.post(
                'https://us-south.ml.cloud.ibm.com/ml/v4/deployments/c9279248-db7c-41d9-945f-536771b01f5e/predictions?version=2021-05-01',
                payloadScoring,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${mltoken}`
                    }
                }
            );

            if (responseScoring.status === 200) {
                res.status(200).json(responseScoring.data);
            } else {
                res.status(responseScoring.status).json({ message: 'Failed to get scoring response', details: responseScoring.data });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error getting scoring response: ' + error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
