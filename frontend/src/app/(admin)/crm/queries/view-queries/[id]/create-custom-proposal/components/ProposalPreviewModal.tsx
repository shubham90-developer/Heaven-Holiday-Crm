"use client";

type ProposalPreviewModalProps = {
  open: boolean;
  loading: boolean;
  html: string;
  onClose: () => void;
  onDownload: () => void;
};

const ProposalPreviewModal = ({
  open,
  loading,
  html,
  onClose,
  onDownload,
}: ProposalPreviewModalProps) => {
  if (!open) return null;

  return (
    <div className="ccp-preview-overlay" role="dialog" aria-modal="true">
      <div className="ccp-preview-modal">
        <div className="ccp-preview-toolbar">
          <div>
            <div className="ccp-preview-title">Proposal preview</div>
            <div className="ccp-preview-hint">
              Review the proposal, then download as PDF from the print dialog.
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="ccp-orange-btn"
              onClick={onDownload}
              disabled={loading || !html}
            >
              Download PDF
            </button>
            <button
              type="button"
              className="ccp-outline-orange-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
        <div className="ccp-preview-body">
          {loading ? (
            <div className="ccp-preview-loading">
              Generating proposal photos and itinerary copy. This can take a few seconds...
            </div>
          ) : (
            <iframe
              title="Custom proposal preview"
              className="ccp-preview-frame"
              srcDoc={html}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalPreviewModal;
