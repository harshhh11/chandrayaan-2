import cv2
import numpy as np
from typing import List, Tuple, Dict, Any
from .base import BaseMatcher, RawMatch

class ClassicalMatcher(BaseMatcher):
    def __init__(self, algorithm: str = "SIFT", ratio_thresh: float = 0.75):
        self.algorithm = algorithm.upper()
        self.ratio_thresh = ratio_thresh

    def match(
        self,
        source_img: np.ndarray,
        reference_img: np.ndarray,
        max_features: int = 2000
    ) -> Tuple[List[RawMatch], Dict[str, Any]]:
        # Initialize detector
        if self.algorithm == "ORB":
            detector = cv2.ORB_create(nfeatures=max_features, fastThreshold=10)
            norm_type = cv2.NORM_HAMMING
        elif self.algorithm == "AKAZE":
            detector = cv2.AKAZE_create()
            norm_type = cv2.NORM_HAMMING
        else: # Default SIFT
            detector = cv2.SIFT_create(nfeatures=max_features, contrastThreshold=0.03, edgeThreshold=10)
            norm_type = cv2.NORM_L2

        # Detect and compute keypoints and descriptors
        kp_src, desc_src = detector.detectAndCompute(source_img, None)
        kp_ref, desc_ref = detector.detectAndCompute(reference_img, None)

        if desc_src is None or desc_ref is None or len(kp_src) == 0 or len(kp_ref) == 0:
            return [], {
                "algorithm": self.algorithm,
                "src_keypoints": len(kp_src) if kp_src else 0,
                "ref_keypoints": len(kp_ref) if kp_ref else 0,
                "candidate_matches": 0,
                "status": "INSUFFICIENT_FEATURES"
            }

        # Match using FLANN or BFMatcher with k-NN (k=2) for Lowe's ratio test
        if norm_type == cv2.NORM_L2:
            # FLANN parameters for SIFT
            FLANN_INDEX_KDTREE = 1
            index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
            search_params = dict(checks=50)
            matcher = cv2.FlannBasedMatcher(index_params, search_params)
        else:
            matcher = cv2.BFMatcher(norm_type, crossCheck=False)

        knn_matches = matcher.knnMatch(desc_src, desc_ref, k=2)

        matches: List[RawMatch] = []
        for m_tuple in knn_matches:
            if len(m_tuple) == 2:
                m, n = m_tuple
                if m.distance < self.ratio_thresh * n.distance:
                    # Lowe's ratio test passed
                    src_pt = kp_src[m.queryIdx].pt
                    ref_pt = kp_ref[m.trainIdx].pt
                    # Calculate confidence score (1.0 - ratio)
                    ratio = m.distance / max(1e-5, n.distance)
                    confidence = max(0.1, min(1.0, 1.0 - ratio))
                    matches.append(RawMatch(src_pt, ref_pt, confidence, m.distance))

        report = {
            "algorithm": self.algorithm,
            "src_keypoints": len(kp_src),
            "ref_keypoints": len(kp_ref),
            "candidate_matches": len(matches),
            "ratio_threshold": self.ratio_thresh,
            "status": "OK" if len(matches) >= 4 else "FEW_MATCHES"
        }

        return matches, report
