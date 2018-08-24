#Region "Imports Statement"
Imports System.IO
Imports System.Text
Imports System.Security.Cryptography
#End Region

Public Interface ICrypto
    Function BlockSize() As Integer
    Function KeySize() As Integer
    Function Encrypt(ByVal data As String) As String
    Function Encrypt(ByVal data As String, ByVal _keyStr() As Byte) As String
    Function Decrypt(ByVal data As String) As String
    Function Decrypt(ByVal data As String, ByVal _keyStr() As Byte) As String
End Interface

Public Class CryptoFactory

    Friend Class SymmetricCryptoAlgorithm
        Implements ICrypto

        ' The key and initialization vector : 
        Private _key() As Byte = {132, 42, 53, 124, 75, 56, 87, 38, 9, 10, 161, 132, 183, _
        91, 105, 16, 117, 218, 149, 230, 221, 212, 235, 64}
        Private _iv() As Byte = {83, 71, 26, 58, 54, 35, 22, 11, 83, 71, 26, 58, 54, 35, 22, 11}

        ' returns the default size, in bits of the iv
        Private Function BlockSize() As Integer Implements ICrypto.BlockSize
            Dim pobjSymAlgo As New RijndaelManaged()

            Return pobjSymAlgo.BlockSize
        End Function

        ' returns the default size, in bits of the key
        Private Function KeySize() As Integer Implements ICrypto.KeySize
            Dim pobjSymAlgo As New RijndaelManaged()

            Return pobjSymAlgo.KeySize
        End Function

        ' decrypts a string that was encrypted using the Encrypt method
        Private Function Decrypt(ByVal data As String) As String Implements ICrypto.Decrypt
            Try
                If data Is Nothing OrElse data = String.Empty Then
                    Return String.Empty
                End If

                Dim inBytes() As Byte = Convert.FromBase64String(data)
                Dim pobjMemStream As New MemoryStream(inBytes, 0, inBytes.Length) ' instead of writing the decrypted text

                Dim pobjSymAlgo As New RijndaelManaged()
                Dim pobjCrypStream As New CryptoStream(pobjMemStream, pobjSymAlgo.CreateDecryptor(_key, _iv), CryptoStreamMode.Read)

                Dim pobjStreamReader As New StreamReader(pobjCrypStream)

                Return pobjStreamReader.ReadToEnd()
            Catch ex As Exception
                Throw ex
            End Try
        End Function

        ' decrypts a string that was encrypted using the Encrypt method
        Private Function Decrypt(ByVal data As String, ByVal _keyStr() As Byte) As String Implements ICrypto.Decrypt
            Try
                If data Is Nothing OrElse data = String.Empty Then
                    Return String.Empty
                End If
                Dim inBytes() As Byte = Convert.FromBase64String(data)
                Dim pobjMemStream As New MemoryStream(inBytes, 0, inBytes.Length) ' instead of writing the decrypted text

                Dim pobjSymAlgo As New RijndaelManaged()
                Dim pobjCrypStream As New CryptoStream(pobjMemStream, pobjSymAlgo.CreateDecryptor(_keyStr, _iv), CryptoStreamMode.Read)

                Dim pobjStreamReader As New StreamReader(pobjCrypStream)

                Return pobjStreamReader.ReadToEnd()
            Catch ex As Exception
                Throw ex
            End Try
        End Function

        ' Encrypts a given string
        Private Function Encrypt(ByVal data As String) As String Implements ICrypto.Encrypt
            If data Is Nothing OrElse data = String.Empty Then
                Return String.Empty
            End If
            'Try
            Dim utf8 As New UTF8Encoding
            Dim inBytes() As Byte = utf8.GetBytes(data) ' ascii encoding uses 7 
            'bytes for characters whereas the encryption uses 8 bytes, thus we use utf8
            Dim pobjMemStream As New MemoryStream() 'instead of writing the encrypted 
            'string to a filestream, I will use a memorystream

            Dim pobjSymAlgo As New RijndaelManaged()
            Dim pobjCrypStream As New CryptoStream(pobjMemStream, pobjSymAlgo.CreateEncryptor(_key, _iv), CryptoStreamMode.Write)

            pobjCrypStream.Write(inBytes, 0, inBytes.Length) ' encrypt
            pobjCrypStream.FlushFinalBlock()

            Return Convert.ToBase64String(pobjMemStream.GetBuffer(), 0, Convert.ToInt32(pobjMemStream.Length))
            'Catch ex As Exception
            '    Throw
            'End Try
        End Function
        ' Encrypts a given string
        Private Function Encrypt(ByVal data As String, ByVal _keyStr() As Byte) As String Implements ICrypto.Encrypt

            If data Is Nothing OrElse data = String.Empty Then
                Return String.Empty
            End If

            'Try
            Dim utf8 As New UTF8Encoding
            Dim inBytes() As Byte = utf8.GetBytes(data) ' ascii encoding uses 7 
            'bytes for characters whereas the encryption uses 8 bytes, thus we use utf8
            Dim pobjMemStream As New MemoryStream() 'instead of writing the encrypted 
            'string to a filestream, I will use a memorystream

            Dim pobjSymAlgo As New RijndaelManaged()
            Dim pobjCrypStream As New CryptoStream(pobjMemStream, pobjSymAlgo.CreateEncryptor(_keyStr, _iv), CryptoStreamMode.Write)

            pobjCrypStream.Write(inBytes, 0, inBytes.Length) ' encrypt
            pobjCrypStream.FlushFinalBlock()

            Return Convert.ToBase64String(pobjMemStream.GetBuffer(), 0, Convert.ToInt32(pobjMemStream.Length))
            'Catch ex As Exception
            '    Throw
            'End Try
        End Function
    End Class


    Public Function MakeCryptographer() As ICrypto

        Return New SymmetricCryptoAlgorithm()

    End Function
End Class

