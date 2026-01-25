import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Brain, TrendingUp, Database, Zap } from "lucide-react";

export default function ChurnPredictionGuidePage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🔮 Churn Prediction Implementation Guide</h1>
        <p className="text-gray-600">How to build a real ML model to predict student dropout using Google AI Studio</p>
      </div>

      <Card className="mb-6 border-2 border-orange-500">
        <CardHeader className="bg-orange-50">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Current Reality Check
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-2">
            <p className="font-semibold text-red-600">❌ What You DON'T Have:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>No actual ML model</li>
              <li>No training pipeline</li>
              <li>No feature engineering</li>
              <li>No model deployment</li>
              <li>ChurnPrediction entity exists but is never populated</li>
            </ul>
            
            <p className="font-semibold text-green-600 mt-4">✅ What You WILL Have:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Real predictive model trained on student data</li>
              <li>Automated daily predictions</li>
              <li>Actionable intervention triggers</li>
              <li>Model retraining pipeline</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        
        {/* Step 1: Data Collection */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Step 1: Collect Training Data
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">First, you need historical data with outcomes. Export student data with these features:</p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">Required Features:</p>
              <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">{`{
  "student_email": "aluno@escola.com",
  "days_since_last_login": 7,
  "completion_rate_last_30_days": 0.3,
  "average_assignment_score": 65,
  "pending_assignments": 5,
  "overdue_assignments": 3,
  "attendance_rate": 0.75,
  "engagement_score": 45,
  "days_enrolled": 120,
  "parent_engagement_score": 30,
  "help_requests_count": 2,
  "progress_trend": -0.15,
  "vark_content_match_rate": 0.6,
  "churned": false  // TARGET VARIABLE (true if student dropped out)
}`}</pre>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <p className="font-semibold text-yellow-800 mb-2">⚠️ You Need Historical Data:</p>
              <p className="text-sm text-yellow-700">You need at least 50-100 students with known outcomes (who dropped out vs who stayed). If you don't have this yet:</p>
              <ol className="list-decimal pl-6 mt-2 space-y-1 text-sm text-yellow-700">
                <li>Start collecting data NOW</li>
                <li>Wait 3-6 months for patterns to emerge</li>
                <li>Use synthetic data initially for testing (I can help generate)</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Google AI Studio Setup */}
        <Card>
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Step 2: Google AI Studio Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <p className="font-semibold">A. Create Google Cloud Project:</p>
              <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-700">
                <li>Go to <a href="https://console.cloud.google.com" className="text-blue-600 underline" target="_blank">console.cloud.google.com</a></li>
                <li>Create new project "InnovaLearn-ML"</li>
                <li>Enable Vertex AI API</li>
                <li>Enable BigQuery API (for data storage)</li>
              </ol>

              <p className="font-semibold mt-4">B. Upload Training Data to BigQuery:</p>
              <div className="bg-gray-50 p-3 rounded">
                <pre className="text-xs overflow-x-auto">{`# Install Google Cloud SDK
pip install google-cloud-bigquery pandas

# Python script to upload data
from google.cloud import bigquery
import pandas as pd

# Load your CSV
df = pd.read_csv('student_churn_data.csv')

# Upload to BigQuery
client = bigquery.Client(project='innovalear-ml')
table_id = 'innovalear-ml.student_data.churn_training'

job = client.load_table_from_dataframe(df, table_id)
job.result()  # Wait for upload`}</pre>
              </div>

              <p className="font-semibold mt-4">C. Create AutoML Model:</p>
              <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-700">
                <li>Go to Vertex AI → Datasets</li>
                <li>Create tabular dataset from BigQuery table</li>
                <li>Select "churned" as target column</li>
                <li>Choose "Classification" model type</li>
                <li>Click "Train New Model" → AutoML</li>
                <li>Training budget: 1-2 hours (costs ~$20-40)</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Model Deployment */}
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              Step 3: Deploy Model & Create Prediction Endpoint
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <p className="font-semibold">A. Deploy Model in Vertex AI:</p>
              <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-700">
                <li>After training completes, go to Models tab</li>
                <li>Click "Deploy to Endpoint"</li>
                <li>Choose machine type: n1-standard-2 (cheap)</li>
                <li>Wait 5-10 minutes for deployment</li>
              </ol>

              <p className="font-semibold mt-4">B. Create Backend Function:</p>
              <div className="bg-gray-50 p-3 rounded">
                <pre className="text-xs overflow-x-auto">{`// functions/predictChurn.js
import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';
import { GoogleAuth } from 'npm:google-auth-library';

const ENDPOINT_ID = 'your-endpoint-id';
const PROJECT_ID = 'innovalear-ml';
const LOCATION = 'us-central1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!['administrador', 'coordenador_pedagogico'].includes(user.user_type)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all active students
    const students = await base44.asServiceRole.entities.User.filter({
      user_type: 'aluno',
      enrollment_status: 'active'
    });

    const predictions = [];

    for (const student of students) {
      // Calculate features
      const features = await calculateStudentFeatures(base44, student.email);
      
      // Call Vertex AI
      const prediction = await predictWithVertexAI(features);
      
      // Store prediction
      await base44.asServiceRole.entities.ChurnPrediction.create({
        student_email: student.email,
        prediction_date: new Date().toISOString(),
        churn_probability: prediction.probability * 100,
        risk_level: getRiskLevel(prediction.probability),
        top_factors: prediction.feature_importance,
        features_snapshot: features,
        model_version: 'v1.0',
        intervention_triggered: prediction.probability > 0.7,
        intervention_type: prediction.probability > 0.7 ? 'immediate_contact' : null
      });

      predictions.push({
        student: student.full_name,
        risk: prediction.probability
      });
    }

    return Response.json({
      success: true,
      predictions_count: predictions.length,
      high_risk_count: predictions.filter(p => p.risk > 0.7).length
    });

  } catch (error) {
    console.error('Churn prediction error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function calculateStudentFeatures(base44, studentEmail) {
  // Get enrollment data
  const enrollments = await base44.entities.Enrollment.filter({ 
    student_email: studentEmail 
  });
  
  // Get assignments
  const assignments = await base44.entities.Assignment.filter({ 
    student_email: studentEmail 
  });
  
  // Get progress
  const progress = await base44.entities.StudentProgress.filter({ 
    student_email: studentEmail 
  });

  // Calculate features
  const now = new Date();
  const lastProgress = progress[progress.length - 1];
  const daysSinceLastActivity = lastProgress 
    ? Math.floor((now - new Date(lastProgress.updated_date)) / (1000 * 60 * 60 * 24))
    : 999;

  const completionRate = enrollments.length > 0
    ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length / 100
    : 0;

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const overdueCount = assignments.filter(a => {
    return a.status === 'pending' && new Date(a.due_date) < now;
  }).length;

  const avgScore = assignments.length > 0
    ? assignments.filter(a => a.grade).reduce((sum, a) => sum + a.grade, 0) / assignments.length
    : 0;

  return {
    days_since_last_login: daysSinceLastActivity,
    completion_rate_last_30_days: completionRate,
    average_assignment_score: avgScore,
    pending_assignments: pendingCount,
    overdue_assignments: overdueCount,
    attendance_rate: 0.85, // Placeholder - implement if you track attendance
    engagement_score: Math.max(0, 100 - (daysSinceLastActivity * 5)),
    days_enrolled: 120, // Calculate from enrollment_date
    parent_engagement_score: 50, // Placeholder
    help_requests_count: 0, // Implement if tracked
    progress_trend: 0, // Calculate based on progress history
    vark_content_match_rate: 0.7 // Placeholder
  };
}

async function predictWithVertexAI(features) {
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  });
  
  const client = await auth.getClient();
  const projectId = PROJECT_ID;
  const location = LOCATION;
  const endpointId = ENDPOINT_ID;
  
  const endpoint = \`https://\${location}-aiplatform.googleapis.com/v1/projects/\${projectId}/locations/\${location}/endpoints/\${endpointId}:predict\`;
  
  const instance = {
    days_since_last_login: features.days_since_last_login,
    completion_rate_last_30_days: features.completion_rate_last_30_days,
    average_assignment_score: features.average_assignment_score,
    pending_assignments: features.pending_assignments,
    overdue_assignments: features.overdue_assignments,
    attendance_rate: features.attendance_rate,
    engagement_score: features.engagement_score
  };

  const response = await client.request({
    url: endpoint,
    method: 'POST',
    data: {
      instances: [instance]
    }
  });

  const prediction = response.data.predictions[0];
  
  return {
    probability: prediction.scores[1], // Probability of churn
    feature_importance: prediction.feature_importance || []
  };
}

function getRiskLevel(probability) {
  if (probability > 0.8) return 'critical';
  if (probability > 0.6) return 'high';
  if (probability > 0.4) return 'moderate';
  return 'low';
}`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Automation */}
        <Card>
          <CardHeader className="bg-indigo-50">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Step 4: Automate Daily Predictions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">Use Google Cloud Scheduler to run predictions daily:</p>
            
            <div className="bg-gray-50 p-3 rounded">
              <pre className="text-xs overflow-x-auto">{`# Create Cloud Scheduler job
gcloud scheduler jobs create http churn-prediction-daily \\
  --location=us-central1 \\
  --schedule="0 2 * * *" \\
  --uri="https://your-app.base44.app/api/functions/predictChurn" \\
  --http-method=POST \\
  --headers="Authorization=Bearer YOUR_SERVICE_ACCOUNT_TOKEN"`}</pre>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="font-semibold text-green-800">✅ What Happens Daily:</p>
              <ol className="list-decimal pl-6 mt-2 space-y-1 text-sm text-green-700">
                <li>Function runs at 2 AM</li>
                <li>Calculates features for all active students</li>
                <li>Gets predictions from Vertex AI</li>
                <li>Stores in ChurnPrediction entity</li>
                <li>Triggers interventions for high-risk students</li>
                <li>Sends notifications to teachers/coordinators</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Costs */}
        <Card className="border-2 border-yellow-500">
          <CardHeader className="bg-yellow-50">
            <CardTitle>💰 Real Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2 text-sm">
              <p><strong>Training (one-time):</strong> R$100-200 (1-2 hours AutoML)</p>
              <p><strong>Deployment:</strong> R$50-100/month (n1-standard-2 instance)</p>
              <p><strong>Predictions:</strong> R$0.05 per 1000 predictions</p>
              <p><strong>BigQuery storage:</strong> R$10-20/month</p>
              <p className="pt-2 border-t font-semibold text-lg">Total: ~R$200/month for production system</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}