{ pkgs ? import <nixpkgs> {} }:
with pkgs; pkgs.mkShell {
  buildInputs = [
    pkg-config
    clang
    llvm
    llvmPackages.libclang
    openssl
    rocksdb
  ];

  LIBCLANG_PATH = "${llvmPackages.libclang.lib}/lib";
  PROTOC = "${protobuf}/bin/protoc";
  ROCKSDB_LIB_DIR = "${rocksdb}/lib";
  BINDGEN_EXTRA_CLANG_ARGS = "-isystem ${llvmPackages.libclang.lib}/lib/clang/${lib.getVersion clang}/include";
}
