from abc import ABC, abstractmethod
import numpy as np
from typing import List, Tuple, Dict, Any

class RawMatch:
    def __init__(self, src_pt: Tuple[float, float], ref_pt: Tuple[float, float], confidence: float, distance: float = 0.0):
        self.src_x = float(src_pt[0])
        self.src_y = float(src_pt[1])
        self.ref_x = float(ref_pt[0])
        self.ref_y = float(ref_pt[1])
        self.confidence = float(confidence)
        self.distance = float(distance)

class BaseMatcher(ABC):
    """Abstract Base Class for Feature Matchers (SIFT, ORB, Cross-Modal, LoFTR, SuperPoint)"""

    @abstractmethod
    def match(
        self,
        source_img: np.ndarray,
        reference_img: np.ndarray,
        max_features: int = 2000
    ) -> Tuple[List[RawMatch], Dict[str, Any]]:
        """
        Extracts features and establishes candidate correspondences between source and reference image.
        Returns list of RawMatch objects and diagnostic telemetry.
        """
        pass
