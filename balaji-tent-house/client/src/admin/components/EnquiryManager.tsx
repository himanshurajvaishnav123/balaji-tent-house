import { useEffect, useState } from "react";
import { Loader2, Trash2, Phone, MapPin, Calendar } from "lucide-react";
import { enquiryApi } from "../../api/client";
import type { Enquiry, EnquiryStatus } from "../../types";

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Contacted: "bg-blue-100 text-blue-800",
  Closed: "bg-green-100 text-green-800",
};

const EnquiryManager = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  const load = (status?: string) => {
    setLoading(true);
    enquiryApi
      .getAll(status)
      .then((res) => setEnquiries(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(filter || undefined), [filter]);

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) => prev.map((e) => (e._id === id ? { ...e, status } : e)));
    try {
      await enquiryApi.updateStatus(id, status);
    } catch {
      load(filter || undefined);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    setEnquiries((prev) => prev.filter((e) => e._id !== id));
    try {
      await enquiryApi.remove(id);
    } catch {
      load(filter || undefined);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {["", "Pending", "Contacted", "Closed"].map((s) => (
          <button
            key={s || "all"}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === s
                ? "bg-maroon text-ivory border-maroon"
                : "bg-white text-charcoal border-charcoal/15 hover:border-maroon"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-maroon" />
        </div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-16 text-charcoal/50 border border-dashed border-charcoal/20 rounded-2xl">
          No enquiries found.
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry._id}
              className="bg-white rounded-xl border border-charcoal/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-semibold text-charcoal">{enquiry.customerName}</h4>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[enquiry.status]}`}>
                    {enquiry.status}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-marigold/20 text-brass">
                    {enquiry.eventType}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-charcoal/70">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {enquiry.phoneNumber}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(enquiry.eventDate).toLocaleDateString("en-IN")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {enquiry.location}
                  </span>
                </div>
                {enquiry.additionalDetails && (
                  <p className="mt-2 text-sm text-charcoal/60">{enquiry.additionalDetails}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={enquiry.status}
                  onChange={(e) => handleStatusChange(enquiry._id, e.target.value as EnquiryStatus)}
                  className="rounded-lg border border-charcoal/15 px-3 py-2 text-sm bg-white focus:border-maroon outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                </select>
                <button
                  onClick={() => handleDelete(enquiry._id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Delete enquiry"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnquiryManager;
