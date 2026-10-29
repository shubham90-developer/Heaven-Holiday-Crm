"use client";

import { Modal } from "react-bootstrap";

type EmailPreviewModalProps = {
  show: boolean;
  onHide: () => void;
  from: string;
  to: string;
  cc: string;
  subject: string;
  html: string;
};

const EmailPreviewModal = ({
  show,
  onHide,
  from,
  to,
  cc,
  subject,
  html,
}: EmailPreviewModalProps) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="enquiry-supplier-package">
      <Modal.Header closeButton className="esp-modal-header">
        <Modal.Title>Email Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="esp-email-preview">
          <div className="esp-email-meta">
            <div>
              <span>From</span>
              <strong>{from || "-"}</strong>
            </div>
            <div>
              <span>To</span>
              <strong>{to || "-"}</strong>
            </div>
            {cc ? (
              <div>
                <span>CC</span>
                <strong>{cc}</strong>
              </div>
            ) : null}
            <div>
              <span>Subject</span>
              <strong>{subject || "-"}</strong>
            </div>
          </div>
          <div
            className="esp-email-body"
            dangerouslySetInnerHTML={{ __html: html || "<p>No email body</p>" }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="esp-send-btn" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmailPreviewModal;
