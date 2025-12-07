from urllib.parse import urlparse
import subprocess
import ssl
import socket

def get_tls_info(host: str, port: int = 443):
    ctx = ssl.create_default_context()
    with ctx.wrap_socket(socket.socket(socket.AF_INET), server_hostname=host) as s:
        s.connect((host, port))
        tls_version = s.version()      # <-- tutaj masz np. 'TLSv1.3'
        cipher = s.cipher()            # ('TLS_AES_256_GCM_SHA384', 'TLSv1.3', 256)
        cert_bin = s.getpeercert(binary_form=True)

    return {
        "host": host,
        "tls_version": tls_version,
        "cipher": cipher,
    }



def get_full_chain(host):
    cmd = ["openssl", "s_client", "-connect", f"{host}:443", "-showcerts"]
    output = subprocess.check_output(cmd, stderr=subprocess.STDOUT)
    return output.decode()