import io
import email
from email import policy
from typing import Tuple

def extract_text_from_pdf(content: bytes) -> str:
    # Try pypdf first
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(content))
        text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
        if text.strip():
            return text.strip()
    except Exception:
        pass

    # Try pdfplumber
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            text = ""
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    text += t + "\n"
            if text.strip():
                return text.strip()
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {e}")

    return ""

def extract_text_from_eml(content: bytes) -> str:
    try:
        msg = email.message_from_bytes(content, policy=policy.default)
        body = ""
        subject = msg.get("Subject", "")
        sender = msg.get("From", "")
        date = msg.get("Date", "")
        
        header_text = f"Subject: {subject}\nFrom: {sender}\nDate: {date}\n\n"
        
        if msg.is_multipart():
            for part in msg.walk():
                ctype = part.get_content_type()
                cdispo = str(part.get('Content-Disposition'))
                if ctype == 'text/plain' and 'attachment' not in cdispo:
                    body += part.get_content()
        else:
            body = msg.get_content()
            
        return header_text + str(body)
    except Exception as e:
        # Fallback to plain decoding
        try:
            return content.decode('utf-8', errors='ignore')
        except Exception:
            raise ValueError(f"Failed to parse email message: {e}")

def extract_text_from_file(filename: str, content: bytes) -> Tuple[str, str]:
    """
    Extracts text from given file content based on filename extension.
    Returns (extracted_text, detected_type).
    """
    ext = filename.lower().split('.')[-1] if '.' in filename else ''
    
    if ext == 'pdf':
        return extract_text_from_pdf(content), 'PDF'
    elif ext == 'eml':
        return extract_text_from_eml(content), 'EML'
    elif ext in ['txt', 'log', 'csv', 'json']:
        try:
            return content.decode('utf-8'), 'TEXT'
        except UnicodeDecodeError:
            return content.decode('latin-1', errors='ignore'), 'TEXT'
    else:
        # Default try utf-8
        try:
            return content.decode('utf-8', errors='ignore'), 'TEXT'
        except Exception as e:
            raise ValueError(f"Unsupported file format: {ext}")
