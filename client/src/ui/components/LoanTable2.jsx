
import { useState } from "react"
import { Badge } from "./sub/badge"
import { Button } from "./sub/button"
import { Card, CardContent } from "./sub/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./sub/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./sub/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./sub/tooltip"
import { Edit, Info, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react"
import getTokenPayload from "../../utils/getTokenPayload"


const statusColorMap = {
  Dipinjam: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Dikembalikan: "bg-green-100 text-green-800 border-green-200",
  Terlambat: "bg-red-100 text-red-800 border-red-200",
  Pending: "bg-blue-100 text-blue-800 border-blue-200",
}

// Sample data
const sampleData = [
  {
    namaPeminjam: "John Doe",
    jenisHak: "Hak Milik",
    nomorHak: "12345/2024",
    kecamatan: "Menteng",
    kelurahan: "Menteng",
    dateBorrowed: "2024-01-15",
    fixDurasi: "30 hari",
    status: "Dipinjam",
    keperluan: "Untuk keperluan pengajuan kredit bank dan proses jual beli properti",
  },
  {
    namaPeminjam: "Jane Smith",
    jenisHak: "Hak Guna Bangunan",
    nomorHak: "67890/2024",
    kecamatan: "Kebayoran",
    kelurahan: "Senayan",
    dateBorrowed: "2024-01-10",
    fixDurasi: "14 hari",
    status: "Dikembalikan",
    keperluan: "Untuk keperluan administrasi perusahaan",
  },
  {
    namaPeminjam: "Bob Johnson",
    jenisHak: "Hak Pakai",
    nomorHak: "11111/2024",
    kecamatan: "Tanah Abang",
    kelurahan: "Bendungan Hilir",
    dateBorrowed: "2023-12-20",
    fixDurasi: "21 hari",
    status: "Terlambat",
    keperluan: "Untuk keperluan pengajuan izin usaha dan dokumen legal lainnya yang membutuhkan sertifikat asli",
  },
]

export default function LoanTable({ data }) {
  const user = getTokenPayload()
  const userRole = user?.role

  const handleAction = (action, index) => {
    console.log(`${action} for row ${index}`)
    // Implement your action logic here
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="rounded-lg border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="w-12">No</TableHead>
                <TableHead className="min-w-[150px]">Peminjam</TableHead>
                <TableHead>Jenis Hak</TableHead>
                <TableHead>Nomor Hak</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Tanggal Pinjam</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20">Keperluan</TableHead>
                {userRole === "admin" && <TableHead className="w-12">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-500">{index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{row.namaPeminjam}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{row.jenisHak}</span>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{row.nomorHak}</code>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{row.kecamatan}</div>
                      <div className="text-gray-500">{row.kelurahan}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{row.dateBorrowed}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{row.fixDurasi}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColorMap[row.status] || ""}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p className="text-sm">{row.keperluan}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  {userRole === "admin" && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction("edit", index)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("status", index)}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Edit Status
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("delete", index)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {data.map((row, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{row.namaPeminjam}</h3>
                  <p className="text-sm text-gray-500">#{index + 1}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={statusColorMap[row.status] || ""}>
                    {row.status}
                  </Badge>
                  {userRole === "admin" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction("edit", index)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("status", index)}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Edit Status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("delete", index)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Jenis Hak:</span>
                  <p className="font-medium">{row.jenisHak}</p>
                </div>
                <div>
                  <span className="text-gray-500">Nomor Hak:</span>
                  <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1">{row.nomorHak}</p>
                </div>
                <div>
                  <span className="text-gray-500">Lokasi:</span>
                  <p className="font-medium">{row.kecamatan}</p>
                  <p className="text-gray-600">{row.kelurahan}</p>
                </div>
                <div>
                  <span className="text-gray-500">Durasi:</span>
                  <p className="font-medium">{row.fixDurasi}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-gray-500 text-sm">Keperluan:</span>
                    <p className="text-sm mt-1 text-gray-700">{row.keperluan}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">Dipinjam: {row.dateBorrowed}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada data</h3>
          <p className="text-gray-500">Belum ada data peminjaman yang tersedia.</p>
        </div>
      )}
    </div>
  )
}
