"use client";

import React, { useState } from "react";
import { MOCK_USER_ORDER_DETAIL } from "@/lib/constants";
import { DetailedOrder, OrderStatusType, PaymentStatusType } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { EditIcon, CreditCardIcon, RefreshIcon, UserOrdersIcon } from "@/components/ui/icons";

export default function UserOrderManagementPage() {
  const [customer, setCustomer] = useState(MOCK_USER_ORDER_DETAIL);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusType>("Completed");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatusType>("Paid");

  // Refund Modal State
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundReason, setRefundReason] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(null);

  // Update order status and payment details
  const handleSaveOrderStatus = (orderId: string) => {
    setCustomer((prev) => ({
      ...prev,
      orders: prev.orders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: selectedStatus,
            paymentDetails: {
              ...order.paymentDetails,
              status: selectedPaymentStatus,
            },
          };
        }
        return order;
      }),
    }));
    setEditingOrderId(null);
    showTempNotification(`Order #${orderId} status updated to '${selectedStatus}' successfully.`);
  };

  // Process refund submission
  const handleProcessRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundOrderId) return;

    const amountNum = parseFloat(refundAmount) || 0;

    setCustomer((prev) => ({
      ...prev,
      orders: prev.orders.map((order) => {
        if (order.id === refundOrderId) {
          const isFullRefund = amountNum >= order.totalAmount;
          return {
            ...order,
            status: isFullRefund ? "Refunded" : order.status,
            paymentDetails: {
              ...order.paymentDetails,
              status: isFullRefund ? "Refunded" : "Partially Refunded",
            },
            refundHistory: [
              ...(order.refundHistory || []),
              {
                refundId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
                amount: amountNum,
                reason: refundReason || "Customer requested refund",
                date: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              },
            ],
          };
        }
        return order;
      }),
    }));

    showTempNotification(`Refund of ${formatCurrency(amountNum)} processed for Order #${refundOrderId}.`);
    setRefundOrderId(null);
    setRefundAmount("");
    setRefundReason("");
  };

  const showTempNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="space-y-8 font-hanken">
      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed top-8 right-8 z-50 p-4 rounded-2xl bg-emerald-500 text-black font-hanken font-bold text-xs shadow-2xl animate-page-zoom flex items-center space-x-2">
          <span>⚡ {notification}</span>
        </div>
      )}

      {/* 1. Customer User Specification Header Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#1b1b1b] border border-[#262626] shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-white text-[#131313] flex items-center justify-center font-geist font-extrabold text-2xl shadow-xl">
              {customer.avatar}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {customer.fullName}
                </h1>
                <span className="px-3 py-1 rounded-full text-[10px] font-geist font-bold tracking-widest uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {customer.loyaltyTier}
                </span>
              </div>
              <p className="text-xs text-[#8e9192] font-geist mt-1">
                {customer.email} • {customer.phone} • Customer since {customer.joinedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#0e0e0e] p-4 rounded-2xl border border-[#262626]">
            <div>
              <span className="text-[10px] font-geist text-[#8e9192] uppercase tracking-wider block">Total Spent</span>
              <span className="text-lg font-geist font-bold text-emerald-400">{formatCurrency(customer.totalSpent)}</span>
            </div>
            <div className="w-px h-8 bg-[#262626]" />
            <div>
              <span className="text-[10px] font-geist text-[#8e9192] uppercase tracking-wider block">Orders Count</span>
              <span className="text-lg font-geist font-bold text-white">{customer.totalOrdersCount} Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Customer Orders Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserOrdersIcon className="w-5 h-5 text-emerald-400" />
            Customer Order History
          </h2>
          <p className="text-xs text-[#8e9192] font-geist mt-0.5">
            Showing all orders for <strong className="text-white">{customer.fullName}</strong> — <span className="text-emerald-400 font-semibold">Latest order listed on top</span>
          </p>
        </div>
      </div>

      {/* 3. List of Customer Orders (LATEST ORDER ON TOP) */}
      <div className="space-y-6">
        {customer.orders.map((order: DetailedOrder, idx: number) => (
          <div
            key={order.id}
            className={cn(
              "p-6 sm:p-8 rounded-3xl bg-[#1b1b1b] border shadow-lg transition-all duration-300 relative",
              idx === 0 ? "border-emerald-500/40 ring-1 ring-emerald-500/20" : "border-[#262626]"
            )}
          >
            {/* Order Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="font-geist font-bold text-lg text-white">{order.id}</span>
                  {idx === 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-geist font-bold bg-emerald-500 text-black uppercase tracking-wider">
                      Latest Order
                    </span>
                  )}
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-geist font-bold tracking-wider uppercase border shadow-xs",
                      order.status === "Completed" && "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                      order.status === "Processing" && "bg-amber-500/15 text-amber-400 border-amber-500/30",
                      order.status === "Pending" && "bg-blue-500/15 text-blue-400 border-blue-500/30",
                      order.status === "Cancelled" && "bg-rose-500/15 text-rose-400 border-rose-500/30",
                      order.status === "Refunded" && "bg-purple-500/15 text-purple-400 border-purple-500/30"
                    )}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs font-geist text-[#8e9192] mt-1">{order.date}</p>
              </div>

              {/* Edit Order Status & Refund Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setEditingOrderId(order.id);
                    setSelectedStatus(order.status);
                    setSelectedPaymentStatus(order.paymentDetails.status);
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#2a2a2a] hover:bg-[#353535] text-white text-xs font-geist font-semibold transition-colors border border-[#353535]"
                >
                  <EditIcon className="w-4 h-4 text-emerald-400" />
                  <span>Edit Order Status</span>
                </button>

                <button
                  onClick={() => {
                    setRefundOrderId(order.id);
                    setRefundAmount(order.totalAmount.toString());
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-geist font-semibold transition-colors border border-rose-500/30"
                >
                  <RefreshIcon className="w-4 h-4" />
                  <span>Issue Refund</span>
                </button>
              </div>
            </div>

            {/* Order Items Table & Payment Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-xs font-geist font-semibold text-[#8e9192] uppercase tracking-wider">
                  Purchased Items
                </h4>
                <div className="space-y-3">
                  {order.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-center justify-between p-4 rounded-2xl bg-[#0e0e0e] border border-[#262626]"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">{item.name}</p>
                        <p className="text-xs font-geist text-[#8e9192]">
                          SKU: {item.sku} • Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-geist font-bold text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center p-4 rounded-2xl bg-[#2a2a2a]/40 border border-[#353535]">
                  <span className="text-sm font-bold text-white">Total Order Amount</span>
                  <span className="text-lg font-geist font-bold text-emerald-400">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Payment & Shipping Information */}
              <div className="p-5 rounded-2xl bg-[#0e0e0e] border border-[#262626] space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-[#262626]">
                  <CreditCardIcon className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">Payment Information</h4>
                </div>

                <div className="space-y-2.5 text-xs font-geist">
                  <div>
                    <span className="text-[#8e9192] block">Payment Gateway:</span>
                    <span className="text-white font-semibold">{order.paymentDetails.method}</span>
                  </div>

                  <div>
                    <span className="text-[#8e9192] block">Transaction ID:</span>
                    <span className="text-emerald-400 font-mono font-medium">{order.paymentDetails.transactionId}</span>
                  </div>

                  <div>
                    <span className="text-[#8e9192] block">Payment Status:</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 inline-block mt-0.5">
                      {order.paymentDetails.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#8e9192] block">Billing Address:</span>
                    <span className="text-[#c4c7c8]">{order.paymentDetails.billingAddress}</span>
                  </div>
                </div>

                {/* Refund History if available */}
                {order.refundHistory && order.refundHistory.length > 0 && (
                  <div className="pt-3 border-t border-[#262626] space-y-2">
                    <h5 className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Refund Details</h5>
                    {order.refundHistory.map((ref) => (
                      <div key={ref.refundId} className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] font-geist">
                        <div className="flex justify-between font-bold text-purple-300">
                          <span>{ref.refundId}</span>
                          <span>{formatCurrency(ref.amount)}</span>
                        </div>
                        <p className="text-[#c4c7c8] mt-1 text-[10px]">{ref.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* EDIT ORDER STATUS MODAL OVERLAY */}
            {editingOrderId === order.id && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="w-full max-w-md p-6 rounded-3xl bg-[#1f1f1f] border border-[#353535] shadow-2xl space-y-5 animate-page-zoom">
                  <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                    <h3 className="text-base font-bold text-white">Edit Order #{order.id}</h3>
                    <button
                      onClick={() => setEditingOrderId(null)}
                      className="text-[#8e9192] hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-geist text-[#8e9192] mb-1.5">Fulfillment Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as OrderStatusType)}
                        className="w-full p-3 rounded-xl bg-[#0e0e0e] border border-[#353535] text-xs font-geist text-white focus:border-white focus:outline-none"
                      >
                        <option value="Completed">Completed</option>
                        <option value="Processing">Processing</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-geist text-[#8e9192] mb-1.5">Payment Ledger Status</label>
                      <select
                        value={selectedPaymentStatus}
                        onChange={(e) => setSelectedPaymentStatus(e.target.value as PaymentStatusType)}
                        className="w-full p-3 rounded-xl bg-[#0e0e0e] border border-[#353535] text-xs font-geist text-white focus:border-white focus:outline-none"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Refunded">Refunded</option>
                        <option value="Partially Refunded">Partially Refunded</option>
                        <option value="Payment Failed">Payment Failed</option>
                        <option value="Pending Capture">Pending Capture</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-3">
                    <button
                      onClick={() => setEditingOrderId(null)}
                      className="px-4 py-2 rounded-xl bg-[#2a2a2a] text-[#c4c7c8] text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveOrderStatus(order.id)}
                      className="px-5 py-2 rounded-xl bg-white text-black text-xs font-bold shadow-md hover:bg-[#e2e2e2]"
                    >
                      Save Status Updates
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PROCESS REFUND MODAL OVERLAY */}
            {refundOrderId === order.id && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <form
                  onSubmit={handleProcessRefund}
                  className="w-full max-w-md p-6 rounded-3xl bg-[#1f1f1f] border border-[#353535] shadow-2xl space-y-5 animate-page-zoom"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                    <h3 className="text-base font-bold text-white">Process Refund for Order #{order.id}</h3>
                    <button
                      type="button"
                      onClick={() => setRefundOrderId(null)}
                      className="text-[#8e9192] hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-geist text-[#8e9192] mb-1.5">Refund Amount ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        max={order.totalAmount}
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        placeholder={`Max ${order.totalAmount}`}
                        required
                        className="w-full p-3 rounded-xl bg-[#0e0e0e] border border-[#353535] text-xs font-geist text-white focus:border-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-geist text-[#8e9192] mb-1.5">Reason for Refund</label>
                      <textarea
                        rows={3}
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        placeholder="e.g. Returned merchandise, shipping delay compensation..."
                        required
                        className="w-full p-3 rounded-xl bg-[#0e0e0e] border border-[#353535] text-xs font-geist text-white focus:border-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setRefundOrderId(null)}
                      className="px-4 py-2 rounded-xl bg-[#2a2a2a] text-[#c4c7c8] text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-md hover:bg-rose-400"
                    >
                      Submit Refund
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
