"use client";

import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { formatWhatsAppPreviewHtml } from "./enquirySupplierUtils";

const WHATSAPP_BG = "https://globaltravelexchange.com/img/whatsappbg.webp";

type WhatsAppShareModalProps = {
  show: boolean;
  onHide: () => void;
  text: string;
};

const WhatsAppShareModal = ({ show, onHide, text }: WhatsAppShareModalProps) => {
  const [message, setMessage] = useState(text);

  useEffect(() => {
    if (show) setMessage(text);
  }, [show, text]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Unable to copy text");
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      contentClassName="esp-wa-modal"
    >
      <Modal.Header closeButton closeVariant="white" className="esp-wa-header">
        <Modal.Title className="d-flex align-items-center gap-2">
          <IconifyIcon icon="mdi:whatsapp" className="fs-24" />
          WhatsApp
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="esp-wa-body"
        style={{ backgroundImage: `url(${WHATSAPP_BG})` }}
      >
        <div
          className="esp-wa-preview"
          dangerouslySetInnerHTML={{ __html: formatWhatsAppPreviewHtml(message) }}
        />
      </Modal.Body>
      <Modal.Footer className="esp-wa-footer">
        <button type="button" className="esp-wa-copy-btn" onClick={handleCopy}>
          <IconifyIcon icon="mdi:content-copy" className="me-1" />
          Copy to clipboard
        </button>
        <button type="button" className="esp-wa-close-btn" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default WhatsAppShareModal;
