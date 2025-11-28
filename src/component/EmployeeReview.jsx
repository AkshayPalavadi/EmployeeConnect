import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import "./EmployeeDetails.css";

export default function EmployeeDetails() {
  const navigate = useNavigate();
  const { email } = useParams();
  const employeeEmail = email || localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  // -----------------------------
  // Initial states
  // -----------------------------
  const [personal, setPersonal] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    email: "",
    phone: "",
    alternativePhone: "",
    gender: "",
    bloodGroup: "",
    emergencyNumber: "",
    nominee1: "",
    nominee1Relation: "",
    nominee1Phone: "",
    nominee1Percentage: "",
    nominee2: "",
    nominee2Relation: "",
    nominee2Phone: "",
    nominee2Percentage: "",
    currentAddress: "",
    landmarkCurrent: "",
    pincodeCurrent: "",
    villageCurrent: "",
    stateCurrent: "",
    permanentAddress: "",
    landmarkPermanent: "",
    pincodePermanent: "",
    villagePermanent: "",
    statePermanent: "",
    aadharNumber: "",
    panNumber: "",
    photo: null,
    aadharUpload: null,
    panUpload: null,
    spouse: "",
    children: [],
    marriageCertificate: null,
  });

  const [education, setEducation] = useState({
    schoolName10: "",
    year10: "",
    cgpa10: "",
    certificate10: null,
    interOrDiploma: "",
    collegeName12: "",
    year12: "",
    cgpa12: "",
    certificate12: null,
    gapReason12: "",
    collegeNameUG: "",
    yearUG: "",
    cgpaUG: "",
    certificateUG: null,
    gapReasonUG: "",
    hasMTech: false,
    collegeNameMTech: "",
    yearMTech: "",
    cgpaMTech: "",
    certificateMTech: null,
    hasCourse: false,
    courseName: "",
    institueName: "",
    courseDuration: "",
    cgpaCourse: "",
    certificateCourse: null,
    yearCourse: "",
  });

  const [professional, setProfessional] = useState({
    employeeId: "",
    dateOfJoining: "",
    role: "",
    department: "",
    hasExperience: false,
    experiences: [
      {
        companyName: "",
        companyLocation: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        duration: "",
        roles: "",
        projects: "",
        skills: "",
        salary: "",
        offerLetter:null,
        relivingLetter: null,
        salarySlips: null,
        hrName: "",
        hrEmail: "",
        hrPhone: "",
        managerName: "",
        managerEmail: "",
        managerPhone: "",
      },
    ],
  });

  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState({
    personal: false,
    education: false,
    professional: false,
  });

  // -----------------------------
  // Blob base for server filenames (only used when backend returns plain filename)
  // -----------------------------
  const BLOB_BASE = "https://empdatastorageaccount.blob.core.windows.net/empfiles/";

  // -----------------------------
  // Helpers: URL and file heuristics
  // -----------------------------
  const getBlobUrl = (f) => {
    if (!f && f !== 0) return null;
    if (typeof File !== "undefined" && f instanceof File) {
      try {
        return URL.createObjectURL(f);
      } catch {
        return null;
      }
    }
    if (typeof f === "object") {
      if (f.path && typeof f.path === "string") return f.path;
      if (f.url && typeof f.url === "string") return f.url;
      if (f.filename && typeof f.filename === "string") {
        const s = f.filename.trim();
        if (s.startsWith("http")) return s;
        return BLOB_BASE + s;
      }
      return null;
    }
    if (typeof f === "string") {
      const s = f.trim();
      if (s === "") return null;
      if (s.startsWith("http://") || s.startsWith("https://")) return s;
      return BLOB_BASE + s;
    }
    return null;
  };

  const looksLikeFile = (val, key = "") => {
    if (val === null || val === undefined) return false;
    if (typeof File !== "undefined" && val instanceof File) return true;
    if (typeof val === "object") {
      if (val.path || val.url || val.filename) return true;
    }
    if (typeof val === "string") {
      const s = val.toLowerCase();
      if (
        s.startsWith("http://") ||
        s.startsWith("https://") ||
        s.endsWith(".pdf") ||
        s.endsWith(".jpg") ||
        s.endsWith(".jpeg") ||
        s.endsWith(".png") ||
        s.endsWith(".doc") ||
        s.endsWith(".docx")
      ) return true;
    }
    const kl = (key || "").toLowerCase();
    if (
      kl.includes("upload") ||
      kl.includes("certificate") ||
      kl.includes("file") ||
      kl.includes("doc") ||
      kl.includes("slip") ||
      kl.includes("letter") ||
      kl.includes("resume") ||
      kl.includes("photo") ||
      kl.includes("proof")
    ) return true;
    return false;
  };

  // -----------------------------
  // Fetch employee (extracted for reuse)
  // -----------------------------
  const fetchEmployee = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!employeeEmail) {
        setError("❌ Employee email missing.");
        setLoading(false);
        return;
      }
      if (!token) {
        setError("❌ No token found. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`/api/employee/${employeeEmail}`, {
        // timeout: 10000,
        headers: { Authorization: `Bearer ${token}` },
      });

      const d = res.data || {};
      if (d.personal) setPersonal((prev) => ({ ...prev, ...d.personal }));
      if (d.education) setEducation((prev) => ({ ...prev, ...d.education }));
      if (d.professional) setProfessional((prev) => ({ ...prev, ...d.professional }));
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) setError("❌ Unauthorized – token expired.");
      else if (err.response?.status === 404) setError("❌ Employee not found.");
      else if (err.code === "ECONNABORTED") setError("⏳ Request timed out.");
      else setError("⚠️ Failed to fetch employee details.");
    } finally {
      setLoading(false);
    }
  }, [employeeEmail, token]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  // -----------------------------
  // Utilities used by rendering
  // -----------------------------
  const orderedEntries = (obj) => {
    if (!obj || typeof obj !== "object") return [];
    return Object.entries(obj);
  };

  const extractFilesFromSection = (sectionObj = {}) => {
    const out = [];
    const entries = orderedEntries(sectionObj);
    entries.forEach(([key, val]) => {
      if (!looksLikeFile(val, key)) return;
      if (Array.isArray(val)) {
        val.forEach((v, idx) => {
          const url = getBlobUrl(v);
          out.push({ label: `${labelize(key)}${val.length > 1 ? ` (${idx + 1})` : ""}`, value: v, url, key, idx });
        });
      } else {
        const url = getBlobUrl(val);
        out.push({ label: labelize(key), value: val, url, key });
      }
    });
    return out;
  };

  const labelize = (key) =>
    String(key)
      .replace(/([A-Z])/g, " $1")
      .replace(/[_\-]+/g, " ")
      .trim();

  // -----------------------------
  // Input handlers
  // -----------------------------
  const handleInputChange = (section, field, value) => {
    if (section === "personal") setPersonal((p) => ({ ...p, [field]: value }));
    else if (section === "education") setEducation((e) => ({ ...e, [field]: value }));
    else if (section === "professional") setProfessional((pr) => ({ ...pr, [field]: value }));
  };

  const handleFileChange = (section, field, file) => {
    if (section === "personal") setPersonal((p) => ({ ...p, [field]: file }));
    else if (section === "education") setEducation((e) => ({ ...e, [field]: file }));
    else if (section === "professional") setProfessional((pr) => ({ ...pr, [field]: file }));
  };

  const handleMultiFileChange = (section, field, fileList) => {
    const arr = fileList ? Array.from(fileList) : null;
    if (section === "personal") setPersonal((p) => ({ ...p, [field]: arr }));
    else if (section === "education") setEducation((e) => ({ ...e, [field]: arr }));
    else if (section === "professional") setProfessional((pr) => ({ ...pr, [field]: arr }));
  };

  const handleExperienceFieldChange = (index, field, value) => {
    setProfessional((prev) => {
      const experiences = Array.isArray(prev.experiences) ? [...prev.experiences] : [];
      experiences[index] = { ...experiences[index], [field]: value };
      return { ...prev, experiences };
    });
  };

  // -----------------------------
  // Build FormData for a section (files separated, JSON for the rest)
  // -----------------------------
  const buildFormDataForSection = (sectionName, sectionObj) => {
    const fd = new FormData();
    const cloneForJson = JSON.parse(JSON.stringify(sectionObj || {}));

    if (sectionName === "professional") {
      const experiences = Array.isArray(sectionObj.experiences) ? sectionObj.experiences : [];
      experiences.forEach((exp, expIdx) => {
        Object.entries(exp || {}).forEach(([k, v]) => {
          if (!looksLikeFile(v, k)) return;
          if (Array.isArray(v)) {
            v.forEach((vv, vi) => {
              if (typeof File !== "undefined" && vv instanceof File) {
                fd.append(`experiences[${expIdx}].${k}[${vi}]`, vv);
              }
            });
            // replace with names in JSON
            try { cloneForJson.experiences[expIdx][k] = v.map((vv) => (typeof vv === "string" ? vv : (vv && vv.name ? vv.name : null))); } catch {}
          } else {
            if (typeof File !== "undefined" && v instanceof File) {
              fd.append(`experiences[${expIdx}].${k}`, v);
              try { cloneForJson.experiences[expIdx][k] = v.name; } catch {}
            } else {
              // leave object/string as-is
            }
          }
        });
      });

      // check top-level professional files
      Object.entries(sectionObj || {}).forEach(([k, v]) => {
        if (k === "experiences") return;
        if (!looksLikeFile(v, k)) return;
        if (Array.isArray(v)) {
          v.forEach((vv, vi) => {
            if (typeof File !== "undefined" && vv instanceof File) fd.append(`${k}[${vi}]`, vv);
          });
          try { cloneForJson[k] = v.map((vv) => (typeof vv === "string" ? vv : (vv && vv.name ? vv.name : null))); } catch {}
        } else {
          if (typeof File !== "undefined" && v instanceof File) {
            fd.append(k, v);
            try { cloneForJson[k] = v.name; } catch {}
          }
        }
      });

      fd.append("professional", JSON.stringify(cloneForJson));
      return fd;
    }

    // personal / education
    Object.entries(sectionObj || {}).forEach(([k, v]) => {
      if (!looksLikeFile(v, k)) return;
      if (Array.isArray(v)) {
        v.forEach((vv, vi) => {
          if (typeof File !== "undefined" && vv instanceof File) fd.append(`${k}[${vi}]`, vv);
        });
        try { cloneForJson[k] = v.map((vv) => (typeof vv === "string" ? vv : (vv && vv.name ? vv.name : null))); } catch {}
      } else {
        if (typeof File !== "undefined" && v instanceof File) {
          fd.append(k, v);
          try { cloneForJson[k] = v.name; } catch {}
        }
      }
    });

    fd.append(sectionName, JSON.stringify(cloneForJson));
    return fd;
  };

  // -----------------------------
  // Update a section (smart save)
  // -----------------------------
  const updateSectionOnServer = async (sectionName) => {
    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    let sectionObj = null;
    if (sectionName === "personal") sectionObj = personal;
    else if (sectionName === "education") sectionObj = education;
    else if (sectionName === "professional") sectionObj = professional;

    if (!sectionObj) {
      alert("Invalid section.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fd = buildFormDataForSection(sectionName, sectionObj);

      let endpoint = "";
      if (sectionName === "personal") endpoint = "/api/personal/update";
      else if (sectionName === "education") endpoint = "/api/education/update";
      else if (sectionName === "professional") endpoint = "/api/professional/update";

      await axios.put(endpoint, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        // timeout: 20000,
      });

      // keep main employee row in sync (send JSON)
      const combined = { personal, education, professional };
      await axios.put(`/api/employee/update/${employeeEmail}`, combined, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        timeout: 15000,
      });

      await fetchEmployee();
      setEditMode((prev) => ({ ...prev, [sectionName]: false }));
      alert("Saved successfully.");
    } catch (err) {
      console.error("Update failed:", err);
      if (err.response?.data?.message) alert("Update failed: " + err.response.data.message);
      else alert("Update failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Delete a file field (ONLY file fields per your choice B)
  // - For experiences files, pass context: { expIndex, fileIndex?, fileKey }
  // - server receives { email, field, context } in JSON body
  // -----------------------------
  const deleteFileField = async ({ sectionName, field, context = {} }) => {
    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    const ok = window.confirm("Are you sure you want to delete this file?");
    if (!ok) return;

    setLoading(true);
    setError("");

    try {
      // prepare body; servers often accept JSON even on DELETE via axios (use data)
      const body = {
        email: employeeEmail,
        field,
        context, // e.g. { expIndex: 0, fileIndex: 1, fileKey: 'relivingLetter' }
      };

      // choose endpoint by sectionName
      let endpoint = "";
      if (sectionName === "personal") endpoint = "/api/personal/delete";
      else if (sectionName === "education") endpoint = "/api/education/delete";
      else if (sectionName === "professional") endpoint = "/api/professional/delete";

      // axios.delete with body: pass { data: body }
      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        data: body,
      });

      // optimistic local update: remove the file from local state
      if (sectionName === "personal") {
        if (context && context.fileKey && typeof context.expIndex === "number") {
          // not relevant for personal, but safe-guard
          setPersonal((p) => ({ ...p }));
        } else {
          // top-level personal field
          setPersonal((p) => ({ ...p, [field]: null }));
        }
      } else if (sectionName === "education") {
        setEducation((e) => ({ ...e, [field]: null }));
      } else if (sectionName === "professional") {
        if (context && typeof context.expIndex === "number") {
          // removing file inside an experience
          setProfessional((pr) => {
            const experiences = Array.isArray(pr.experiences) ? [...pr.experiences] : [];
            const exp = { ...(experiences[context.expIndex] || {}) };
            // if fileIndex provided and value is array
            if (typeof context.fileIndex === "number" && Array.isArray(exp[field])) {
              const arr = [...exp[field]];
              arr.splice(context.fileIndex, 1);
              exp[field] = arr;
            } else {
              // single file field
              exp[field] = null;
            }
            experiences[context.expIndex] = exp;
            return { ...pr, experiences };
          });
        } else {
          // top-level professional file field
          setProfessional((pr) => ({ ...pr, [field]: null }));
        }
      }

      // re-fetch latest state from server to be safe
      await fetchEmployee();
      alert("File deleted.");
    } catch (err) {
      console.error("Delete file failed:", err);
      alert("Delete failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Render helpers
  // -----------------------------
  const renderField = (sectionName, key, value) => {
    const isFile = looksLikeFile(value, key);
    const inEdit = editMode[sectionName];

    const hidden = ["__v", "_id"];
    if (hidden.includes(key)) return null;

    if (isFile) {
      if (Array.isArray(value)) {
        return (
          <div key={key}>
            <b>{labelize(key)}:</b>{" "}
            {inEdit ? (
              <>
                <input type="file" multiple onChange={(e) => handleMultiFileChange(sectionName, key, e.target.files)} />
                <div style={{ marginTop: 6 }}>
                  {value.length === 0 ? (
                    <span>Not uploaded</span>
                  ) : (
                    value.map((v, i) => {
                      const url = getBlobUrl(v);
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {url ? <a href={url} target="_blank" rel="noreferrer">{labelize(key)} {value.length > 1 ? `(${i + 1})` : ""}</a> : <span>{typeof v === "string" ? v : (v.name || "file")}</span>}
                          <span style={{ cursor: "pointer", color: "red" }} onClick={() => deleteFileField({ sectionName, field: key, context: { fileIndex: i } })}>🗑</span>
                        </div>
                      );
                    })
                  )
                  }
                </div>
              </>
            ) : (
              <div>
                {value.length === 0 ? (
                  <span>Not uploaded</span>
                ) : (
                  value.map((v, i) => {
                    const url = getBlobUrl(v);
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {url ? <a href={url} target="_blank" rel="noreferrer">{labelize(key)} {value.length > 1 ? `(${i + 1})` : ""}</a> : <span>{typeof v === "string" ? v : (v.name || "file")}</span>}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      }

      // single file
      return (
        <div key={key}>
          <b>{labelize(key)}:</b>{" "}
          {inEdit ? (
            <>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleFileChange(sectionName, key, file);
                }}
              />
              <span style={{ marginLeft: 8, cursor: "pointer", color: "red" }} onClick={() => deleteFileField({ sectionName, field: key })}>🗑</span>
            </>
          ) : (
            (() => {
              const url = getBlobUrl(value);
              if (url) return <><a href={url} target="_blank" rel="noreferrer">View File</a></>;
              if (typeof File !== "undefined" && value instanceof File) return <span>{value.name}</span>;
              if (typeof value === "string") return <span>{value}</span>;
              return <span>Not uploaded</span>;
            })()
          )}
        </div>
      );
    }

    // non-file value
    return (
      <p key={key}>
        <b>{labelize(key)}:</b>{" "}
        {inEdit ? (
          <input
            type={key.toLowerCase().includes("date") ? "date" : "text"}
            value={value === null || value === undefined ? "" : value}
            onChange={(e) => handleInputChange(sectionName, key, e.target.value)}
          />
        ) : (
          (value !== undefined && value !== null && value !== "") ? value.toString() : "N/A"
        )}
      </p>
    );
  };

  const renderExperience = (exp, idx) => {
    const expKeys = [
      "companyName",
      "companyLocation",
      "jobTitle",
      "startDate",
      "endDate",
      "duration",
      "roles",
      "projects",
      "skills",
      "salary",
      "relivingLetter",
      "salarySlips",
      "hrName",
      "hrEmail",
      "hrPhone",
      "managerName",
      "managerEmail",
      "managerPhone",
    ];

    return (
      <div key={idx} className="experience-block" style={{ border: "1px solid #eee", padding: 8, marginBottom: 8, position: 'relative' }}>
        <h5 style={{ margin: 0 }}>
          Experience {idx + 1}
          {editMode.professional && (
            <span
              style={{ color: "red", cursor: "pointer", float: "right" }}
              onClick={() => {
                if (!window.confirm("Remove this experience?")) return;
                setProfessional((prev) => {
                  const experiences = Array.isArray(prev.experiences) ? [...prev.experiences] : [];
                  experiences.splice(idx, 1);
                  return { ...prev, experiences };
                });
              }}
            >
              🗑
            </span>
          )}
        </h5>

        {expKeys.map((k) => {
          const v = exp[k];
          const isFile = looksLikeFile(v, k);
          const inEdit = editMode.professional;

          if (isFile) {
            if (Array.isArray(v)) {
              return (
                <div key={k}>
                  <b>{labelize(k)}:</b>{" "}
                  {inEdit ? (
                    <>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleExperienceFieldChange(idx, k, Array.from(e.target.files))}
                      />
                      <div style={{ marginTop: 6 }}>
                        {v.map((vv, i) => {
                          const url = getBlobUrl(vv);
                          return (
                            <div key={i} style={{ display: "flex", flexDirection:"row",alignItems: "center", gap: 8 }}>
                              {url ? <a href={url} target="_blank" rel="noreferrer">{labelize(k)} {v.length>1?`(${i+1})`:''}</a> : <span>{typeof vv === "string"?vv:(vv.name||"file")}</span>}
                              <span style={{ cursor: "pointer", color: "red" }} onClick={() => deleteFileField({ sectionName: "professional", field: k, context: { expIndex: idx, fileIndex: i } })}>🗑</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div>
                      {v && v.length > 0 ? v.map((vv, i) => {
                        const url = getBlobUrl(vv);
                        return (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {url ? <a href={url} target="_blank" rel="noreferrer">{labelize(k)} {v.length>1?`(${i+1})`:''}</a> : <span>{typeof vv === "string"?vv:(vv.name||"file")}</span>}
                          </div>
                        );
                      }) : <span>Not uploaded</span>}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={k}>
                <b>{labelize(k)}:</b>{" "}
                {inEdit ? (
                  <>
                    <input type="file" onChange={(e) => handleExperienceFieldChange(idx, k, e.target.files?.[0] || null)} />
                    <span style={{ marginLeft: 8, cursor: "pointer", color: "red" }} onClick={() => deleteFileField({ sectionName: "professional", field: k, context: { expIndex: idx } })}>🗑</span>
                  </>
                ) : (
                  (() => {
                    const url = getBlobUrl(v);
                    if (url) return <><a href={url} target="_blank" rel="noreferrer">View File</a></>;
                    if (typeof File !== "undefined" && v instanceof File) return <span>{v.name}</span>;
                    if (typeof v === "string") return <span>{v}</span>;
                    return <span>Not uploaded</span>;
                  })()
                )}
              </div>
            );
          }

          return (
            <p key={k}>
              <b>{labelize(k)}:</b>{" "}
              {editMode.professional ? (
                <input
                  type={k.toLowerCase().includes("date") ? "date" : "text"}
                  value={v === null || v === undefined ? "" : v}
                  onChange={(e) => handleExperienceFieldChange(idx, k, e.target.value)}
                />
              ) : (
                v || "N/A"
              )}
            </p>
          );
        })}
      </div>
    );
  };

  const renderSection = (sectionObj, sectionName) => {
    const entries = orderedEntries(sectionObj);
    const files = extractFilesFromSection(sectionObj);

    return (
      <div className="education-info">
        <div className="info-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>{sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Info</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              className="edit-icon"
              onClick={() => setEditMode((prev) => ({ ...prev, [sectionName]: !prev[sectionName] }))}
              role="button"
              aria-label={`toggle ${sectionName} edit`}
              style={{ cursor: "pointer" }}
            >
              ✎
            </span>

            {/* No global delete for section: we only delete file fields (per user choice) */}
          </div>
        </div>

        <div className="fields-list">
          {entries.map(([key, val]) => {
            if (sectionName === "professional" && key === "experiences") return null;
            if (["__v", "_id"].includes(key)) return null;
            return renderField(sectionName, key, val);
          })}
        </div>

        {sectionName === "professional" && (
          <div style={{ marginTop: 12 }}>
            <h4>Experiences</h4>
            {(professional.experiences || []).map((exp, idx) => renderExperience(exp, idx))}
            {editMode.professional && (
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={() =>
                    setProfessional((prev) => ({
                      ...prev,
                      experiences: [
                        ...(prev.experiences || []),
                        {
                          companyName: "",
                          companyLocation: "",
                          jobTitle: "",
                          startDate: "",
                          endDate: "",
                          duration: "",
                          roles: "",
                          projects: "",
                          skills: "",
                          salary: "",
                          relivingLetter: null,
                          salarySlips: null,
                          hrName: "",
                          hrEmail: "",
                          hrPhone: "",
                          managerName: "",
                          managerEmail: "",
                          managerPhone: "",
                        },
                      ],
                    }))
                  }
                >
                  Add Experience
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <h4>Uploaded Documents</h4>
          {files.length === 0 ? (
            <p style={{ color: "#666" }}>No documents uploaded for this section.</p>
          ) : (
            files.map((f, i) => (
              <p key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <b style={{ minWidth: 160 }}>{f.label}:</b>
                {f.url ? <a href={f.url} target="_blank" rel="noreferrer">View File</a> : <span>{typeof f.value === "string" ? f.value : (f.value?.name || "file")}</span>}
                {/* allow delete top-level files from this list (only for top-level; experience files handled in experience rendering) */}
                {editMode[sectionName] && (
                  <span style={{ cursor: "pointer", color: "red" }} onClick={() => deleteFileField({ sectionName, field: f.key, context: { fileIndex: f.idx } })}>🗑</span>
                )}
              </p>
            ))
          )}
        </div>

        {editMode[sectionName] && (
          <button
            className="save-btn"
            onClick={() => {
              updateSectionOnServer(sectionName);
            }}
          >
            Save
          </button>
        )}
      </div>
    );
  };

  // -----------------------------
  // UI Loading / Error
  // -----------------------------
  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>⏳ Loading employee details...</p>
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
        <p>{error}</p>
      </div>
    );

  // -----------------------------
  // Render main UI
  // -----------------------------
  return (
    <div className="employee-details-container">
      <button className="back-button" onClick={() => navigate("/admin/employees")}>
        ← Back
      </button>

      {/* HEADER */}
      <div className="employee-header">
        <img
          src={
            (personal.photo && typeof personal.photo === "object" ? (personal.photo.path || personal.photo.url) : personal.photo) ||
            "https://i.ibb.co/5Y8N8tL/avatar.png"
          }
          alt={personal.firstName || "Employee"}
          className="emp-photo"
        />
        <div className="emp-info">
          <p><strong>Name:</strong> {personal.firstName || "N/A"} {personal.lastName || ""}</p>
          <p><strong>Email:</strong> {personal.email || "N/A"}</p>
          <p><strong>Phone:</strong> {personal.phone || "N/A"}</p>
          <p><strong>Blood Group:</strong> {personal.bloodGroup || "N/A"}</p>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs-employee">
        {["personal", "education", "professional"].map((tab) => (
          <span
            key={tab}
            className={`tab-employee ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </span>
        ))}
      </div>

      {/* CONTENT */}
      {activeTab === "personal" && renderSection(personal, "personal")}
      {activeTab === "education" && renderSection(education, "education")}
      {activeTab === "professional" && renderSection(professional, "professional")}
    </div>
  );
}
