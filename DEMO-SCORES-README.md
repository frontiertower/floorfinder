# Demo Scores for Hackathon Jury System

This directory contains demo scoring data to populate the jury walk application for demonstration purposes.

## 📊 Demo Data Overview

- **Total Teams**: 30 teams with realistic project data
- **Total Jurors**: 15 jurors (Juror 1 through Juror 15)
- **Total Ratings**: 450 individual team ratings
- **Tracks Included**:
  - Passthrough Camera API
  - Immersive Entertainment
  - Hand Tracking
  - MR and VR
  - Project Upgrade

## 🏆 Configured Winners (Boosted Scores)

The demo scores include boosted ratings for the actual hackathon winners:

### **Project Upgrade Track**
- 🥇 **Winner**: Edgelord (Room 700-SF13)
- 🥈 **Runner Up**: Staxel (Room 217-SF04)

### **MR and VR Track**
- 🥇 **Winner**: TakeOver (Room 1600-SF22)
- 🥈 **Runner Up**: PathfinderXR (Room 218-SF05)

### **Passthrough Camera API Track**
- 🥇 **Winner**: ThatsMyJam (Room 1201-SF17)
- 🥈 **Runner Up**: JAE-Z (Room 700-SF15)

### **Hand Tracking Track**
- 🥇 **Winner**: TakeOver (Room 1600-SF22)
- 🥈 **Runner Up**: [Can be configured based on available teams]

### **Immersive Entertainment Track**
- 🥇 **Winner**: Hygge (Room 1601-SF21)

## 📁 Files

- `demo-scores-juror-[1-15].json` - Individual juror rating files
- `create-demo-json.js` - Script that generated the demo data
- `upload-demo-scores.js` - Script for uploading to production (requires auth)

## 🚀 How to Use

### Option 1: Manual Import (Recommended)
1. Access the jury walk interface
2. Select a specific juror (e.g., "Juror 1")
3. Use the import functionality to upload the corresponding JSON file
4. Repeat for other jurors as needed

### Option 2: API Upload (If Authenticated)
```bash
node scripts/upload-demo-scores.js
```

## 📋 Demo Score Structure

Each JSON file contains:
```json
{
  "judgeId": "Juror 1",
  "ratings": {
    "teamKey": {
      "teamName": "Team Name",
      "roomNumber": "Room-ID",
      "tracks": "Primary Track",
      "addonTracks": "Add-on Track",
      "concept": 4.2,
      "quality": 4.1,
      "implementation": 4.3,
      "passthroughCameraAPI": 3.8,
      "immersiveEntertainment": 2.1,
      "handTracking": 4.5,
      "mrAndVR": 2.3,
      "projectUpgrade": 1.9,
      "total": 27.2,
      "notes": "Great innovative concept...",
      "lastUpdated": "2025-12-09T23:14:31.187Z"
    }
  }
}
```

## 🎯 Expected Results

After importing the demo scores:
- **Winners section** will display the configured track winners
- **Overall rankings** will show realistic score distributions
- **Individual juror views** will have complete scoring data
- **Export functionality** will work with full dataset

The scores are designed to create realistic competitive results while ensuring the actual hackathon winners appear at the top of their respective tracks.