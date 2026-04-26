import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Button, Alert, Typography, Space, Modal } from "antd";
import { Link } from "umi";
import { useI18n } from "@/hooks/useI18n";
import { validateAndNormalizePlan } from "@/services/index";
import type { PlanData } from "@/types/plan";
import examplePlan from "@/examples/plans.json";

const { Paragraph } = Typography;

const EXAMPLE_JSON = JSON.stringify(examplePlan, null, 2);

function highlightJSON(raw: string): string {
  let html = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // strings
  html = html.replace(
    /"([^"\\]|\\.)*"/g,
    '<span class="tk-str">$&</span>',
  );

  // key strings (followed by colon)
  html = html.replace(
    /<span class="tk-str">((\s*)("[^"]*"))<\/span>(\s*:)/g,
    '<span class="tk-key">$1</span>$4',
  );

  // numbers
  html = html.replace(
    /\b(-?\d+(\.\d+)?([eE][+-]?\d+)?)\b/g,
    '<span class="tk-num">$1</span>',
  );

  // booleans and null
  html = html.replace(
    /\b(true|false|null)\b/g,
    '<span class="tk-bool">$1</span>',
  );

  return html;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onImport: (plan: PlanData) => Promise<void>;
}

export default function PlanImporter({ open, onClose, onImport }: Props) {
  const { t } = useI18n();
  const [jsonText, setJsonText] = useState("");
  const [errors, setErrors] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumRef = useRef<HTMLDivElement>(null);

  const lines = useMemo(() => jsonText.split("\n"), [jsonText]);
  const highlighted = useMemo(() => highlightJSON(jsonText), [jsonText]);

  // sync scroll between textarea and pre/line-numbers
  const syncScroll = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (preRef.current) preRef.current.scrollTop = ta.scrollTop;
    if (preRef.current) preRef.current.scrollLeft = ta.scrollLeft;
    if (lineNumRef.current) lineNumRef.current.scrollTop = ta.scrollTop;
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const v = jsonText;
        setJsonText(v.substring(0, start) + "  " + v.substring(end));
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
    },
    [jsonText],
  );

  const handleTryExample = useCallback(() => {
    setJsonText(EXAMPLE_JSON);
    setErrors(null);
  }, []);

  const handleImport = async () => {
    setErrors(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText.trim());
    } catch {
      setErrors([t("importer.invalidJson")]);
      return;
    }
    const result = validateAndNormalizePlan(parsed);
    if (!result.valid || !result.plan) {
      setErrors(result.errors || [t("importer.invalidJson")]);
      return;
    }
    setLoading(true);
    try {
      await onImport(result.plan);
      setJsonText("");
      onClose();
    } catch {
      setErrors([t("importer.invalidJson")]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setJsonText("");
    setErrors(null);
    onClose();
  };

  // reset on open
  useEffect(() => {
    if (open) {
      setJsonText("");
      setErrors(null);
    }
  }, [open]);

  return (
    <Modal
      title={t("importer.title")}
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          key="import"
          type="primary"
          loading={loading}
          onClick={handleImport}
        >
          {loading ? t("importer.importing") : t("plans.import")}
        </Button>,
      ]}
      width={680}
      destroyOnHidden
    >
      <Space orientation="vertical" style={{ width: "100%" }} size="middle">
        <Paragraph
          type="secondary"
          style={{
            background: "rgba(255,255,255,0.04)",
            padding: 12,
            borderRadius: 8,
            marginBottom: 0,
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          {t("importer.help")}
          <br />
          <Link to="/help">{t("importer.helpLink")}</Link>
        </Paragraph>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button size="small" onClick={handleTryExample}>
            {t("importer.tryExample")}
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            border: "1px solid rgba(128,128,128,0.3)",
            borderRadius: 8,
            overflow: "hidden",
            background: "rgba(0,0,0,0.2)",
            minHeight: 320,
            maxHeight: "60vh",
          }}
        >
          {/* line numbers */}
          <div
            ref={lineNumRef}
            style={{
              padding: "12px 10px 12px 12px",
              textAlign: "right",
              color: "rgba(255,255,255,0.25)",
              fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace",
              fontSize: 13,
              lineHeight: "20px",
              userSelect: "none",
              overflow: "hidden",
              flexShrink: 0,
              minWidth: 40,
            }}
          >
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* editor area */}
          <div
            style={{
              position: "relative",
              flex: 1,
              overflow: "hidden",
            }}
          >
            {/* highlighted overlay */}
            <pre
              ref={preRef}
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                margin: 0,
                padding: "12px 12px 12px 0",
                fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace",
                fontSize: 13,
                lineHeight: "20px",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                overflow: "hidden",
                color: "rgba(255,255,255,0.85)",
                pointerEvents: "none",
              }}
              dangerouslySetInnerHTML={{ __html: highlighted + "\n" }}
            />

            {/* textarea (transparent, for input) */}
            <textarea
              ref={textareaRef}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              onScroll={syncScroll}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              placeholder={t("importer.placeholder")}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: 320,
                padding: "12px 12px 12px 0",
                border: "none",
                outline: "none",
                resize: "none",
                fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace",
                fontSize: 13,
                lineHeight: "20px",
                color: "transparent",
                caretColor: "rgba(255,255,255,0.85)",
                background: "transparent",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                overflow: "auto",
                tabSize: 2,
              }}
            />
          </div>
        </div>

        {/* syntax highlight styles */}
        <style>{`
          .tk-str { color: #98c379; }
          .tk-key { color: #61afef; }
          .tk-num { color: #d19a66; }
          .tk-bool { color: #c678dd; }
        `}</style>

        {errors && errors.length > 0 && (
          <Alert
            type="error"
            title={t("importer.missingFields")}
            description={
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            }
            showIcon
          />
        )}
      </Space>
    </Modal>
  );
}
