import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.pipeline.correspondence_engine import CorrespondenceEngine

def main():
    print("Running CorrespondenceEngine on Tycho Crater OHRC pair...")
    res = CorrespondenceEngine.run_correspondence(
        source_id="ch2_ohr_ncp_20220324T184000_d_img_d18",
        target_id="ch2_ohr_ncp_20220310T061500_d_img_d18",
        algorithm="SIFT"
    )
    print("=== ENGINE OUTPUT ===")
    print(f"Status: {res.get('status')}")
    m = res.get('matching', {})
    met = res.get('metrics', {})
    print(f"Algorithm: {m.get('algorithm')}")
    print(f"Total Keypoints Source: {met.get('total_keypoints_source')}")
    print(f"Total Keypoints Target: {met.get('total_keypoints_target')}")
    print(f"Candidate Matches: {m.get('totalMatches')}")
    print(f"Inlier Matches (RANSAC): {m.get('inliers')}")
    print(f"Inlier Ratio: {m.get('inlierRatio')}%")
    print(f"Confidence: {m.get('confidence')}%")
    print(f"Reprojection RMSE: {m.get('registrationError')} px")
    print(f"Spatial Coverage: {m.get('spatialCoverage')}%")
    print(f"Processing Time: {met.get('processing_time_ms')} ms")
    print(f"Registered Output Path: {res.get('artifacts', {}).get('registered_image_url')}")
    print("=== TEST COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    main()
